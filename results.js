document.addEventListener('DOMContentLoaded', function() {
    let forecastData = null;
    let isLoggedIn = false;

    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.querySelector('.user-menu');
    const loggedInInfo = document.querySelector('.user-info.logged-in');
    const loggedOutInfo = document.querySelector('.user-info.logged-out');
    const userName = document.querySelector('.user-name');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const shareBtn = document.querySelector('.share-btn');
    const printBtn = document.querySelector('.print-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const forecastId = urlParams.get('id');

    if (forecastId) {
        loadForecastData(forecastId);
    } else {
        showNotification('לא נמצאה תחזית. מופנה לדף הבית.', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
    }

    checkLoginStatus();

    userMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        userMenu.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target) && e.target !== userMenuBtn) {
            userMenu.classList.remove('active');
        }
    });

    loginBtn.addEventListener('click', () => showModal(loginModal));
    registerBtn.addEventListener('click', () => showModal(registerModal));

    switchToRegister.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal(loginModal);
        showModal(registerModal);
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal(registerModal);
        showModal(loginModal);
    });

    closeModalButtons.forEach(button => button.addEventListener('click', () => hideModal(button.closest('.modal'))));

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration();
    });

    logoutBtn.addEventListener('click', handleLogout);

    shareBtn.addEventListener('click', shareForecast);
    printBtn.addEventListener('click', () => window.print());

    function loadForecastData(id) {
        showLoadingAnimation();

        try {
            setTimeout(() => {
                forecastData = generateMockForecastData(id);
                displayForecastData(forecastData);
                hideLoadingAnimation();
            }, 1000);
        } catch (e) {
            console.error('Error loading forecast data:', e);
            hideLoadingAnimation();
            showNotification('טעינת הנתונים נכשלה, אנא נסה שנית.', 'error');
        }
    }

    function shareForecast() {
        if (navigator.share) {
            navigator.share({
                title: 'תחזית נומרולוגית אישית',
                text: 'הנה התחזית הנומרולוגית האישית שלי!',
                url: window.location.href
            })
            .then(() => showNotification('התחזית שותפה בהצלחה!', 'success'))
            .catch(error => {
                console.log('שגיאה בשיתוף:', error);
                showNotification('השיתוף נכשל, אנא נסה שנית.', 'error');
            });
        } else {
            const shareUrl = window.location.href;
            prompt('העתק את הקישור הבא לשיתוף התחזית:', shareUrl);
            showNotification('הקישור הועתק ללוח.', 'info');
        }
    }

    function saveForecastHistory(id, data) {
        try {
            let history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
            if (history.length >= 3 && !isUserLoggedIn()) {
                history.shift();
            }
            history.push({ id, type: data.forecastType, date: new Date().toISOString(), data });
            localStorage.setItem('forecastHistory', JSON.stringify(history));
        } catch (e) {
            console.error('Error saving forecast history:', e);
            showNotification('אירעה שגיאה בשמירת התחזית. אנא נסה שנית.', 'error');
        }
    }

    // שאר הפונקציות ללא שינוי (displayForecastData, createNumerologyWheel, animateElements, checkLoginStatus, handleLogin, handleRegistration, handleLogout, showModal, hideModal, showLoadingAnimation, hideLoadingAnimation, showNotification, formatDate, generateMockForecastData)
});
