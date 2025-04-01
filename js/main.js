document.addEventListener('DOMContentLoaded', function() {
    let pendingForecastData = null;

    const personalForm = document.getElementById('personal-form');
    const professionalForm = document.getElementById('professional-form');
    const coupleForm = document.getElementById('couple-form');

    const personalCube = document.getElementById('personal-forecast');
    const professionalCube = document.getElementById('professional-forecast');
    const coupleCube = document.getElementById('couple-forecast');

    personalCube.addEventListener('click', function() {
        showForm(personalForm);
        setActiveCube(personalCube);
    });

    professionalCube.addEventListener('click', function() {
        showForm(professionalForm);
        setActiveCube(professionalCube);
    });

    coupleCube.addEventListener('click', function() {
        showForm(coupleForm);
        setActiveCube(coupleCube);
    });

    personalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'personal');
    });

    professionalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'professional');
    });

    coupleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'couple');
    });

    function showForm(formToShow) {
        document.querySelectorAll('.forecast-form').forEach(form => form.classList.add('hidden'));
        formToShow.classList.remove('hidden');
        formToShow.style.opacity = '0';
        setTimeout(() => formToShow.style.opacity = '1', 50);
    }

    function setActiveCube(activeCube) {
        document.querySelectorAll('.cube').forEach(cube => {
            cube.classList.remove('active', 'inactive');
            if (cube !== activeCube) cube.classList.add('inactive');
        });
        activeCube.classList.add('active');
    }

    function handleFormSubmission(form, type) {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        data.forecastType = type;
        submitFormData(data);
    }

    function submitFormData(data) {
        const isFirstForecast = checkIfFirstForecast();
        if (!isFirstForecast && !isUserLoggedIn()) {
            pendingForecastData = data;
            showRegistrationModal();
            return;
        }
        showLoadingAnimation();
        setTimeout(() => {
            hideLoadingAnimation();
            navigateToResults(data);
        }, 1500);
    }

    function navigateToResults(data) {
        const forecastId = Date.now().toString();
        saveForecastHistory(forecastId, data);
        let url;
        switch(data.forecastType) {
            case 'personal': url = `personal-results.html?id=${forecastId}`; break;
            case 'professional': url = `professional-results.html?id=${forecastId}`; break;
            case 'couple': url = `couple-results.html?id=${forecastId}`; break;
            default: url = `results.html?id=${forecastId}`;
        }
        console.log('Navigating to:', url);
        window.location.href = url;
    }

    function showRegistrationModal() {
        const modalEl = document.createElement('div');
        modalEl.className = 'registration-modal';
        modalEl.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>הרשמה נדרשת</h2>
                <form id="registration-form">
                    <input type="text" id="reg-name" required placeholder="שם מלא">
                    <input type="email" id="reg-email" required placeholder="אימייל">
                    <input type="password" id="reg-password" required placeholder="סיסמה">
                    <button type="submit">הרשם</button>
                </form>
            </div>
        `;
        document.body.appendChild(modalEl);
        setupRegistrationModalEvents(modalEl);
        setTimeout(() => modalEl.style.opacity = '1', 10);
    }

    function setupRegistrationModalEvents(modal) {
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('#registration-form').addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('userLoggedIn', 'true');
            modal.remove();
            if (pendingForecastData) {
                submitFormData(pendingForecastData);
                pendingForecastData = null;
            } else window.location.href = 'index.html';
        });
    }

    function checkIfFirstForecast() {
        return !localStorage.getItem('forecastHistory');
    }

    function isUserLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    function saveForecastHistory(id, data) {
        let history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
        if (history.length >= 3 && !isUserLoggedIn()) history.shift();
        history.push({ id, type: data.forecastType, date: new Date().toISOString(), data });
        localStorage.setItem('forecastHistory', JSON.stringify(history));
    }

    function showLoadingAnimation() {}
    function hideLoadingAnimation() {}

    setActiveCube(personalCube);
    showForm(personalForm);
});
