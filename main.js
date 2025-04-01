document.addEventListener('DOMContentLoaded', function() {
    let pendingForecastData = null;

    // בתוך הפונקציה submitFormData:
    function submitFormData(data) {
        const isFirstForecast = checkIfFirstForecast();

        if (!isFirstForecast && !isUserLoggedIn()) {
            pendingForecastData = data;
            showRegistrationModal();
            return;
        }

        console.log('שולח נתונים לשרת:', data);

        showLoadingAnimation();
        setTimeout(() => {
            hideLoadingAnimation();
            navigateToResults(data);
        }, 1500);
    }

    // שינוי בפונקציה setupRegistrationModalEvents:
    function setupRegistrationModalEvents(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        const form = modal.querySelector('#registration-form');

        closeBtn.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => document.body.removeChild(modal), 300);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('userLoggedIn', 'true');

            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                if (pendingForecastData) {
                    submitFormData(pendingForecastData);
                    pendingForecastData = null;
                } else {
                    window.location.href = 'index.html';
                }
            }, 300);
        });
    }

    // ודא שיתר הקוד שלך (האזנת אירועים לטפסים וכו') נשאר ללא שינוי

    // ... (שאר הקוד שלך) ...
});
