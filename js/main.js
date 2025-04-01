document.addEventListener('DOMContentLoaded', function() {
    // אלמנטים של טפסים
    const personalForm = document.getElementById('personal-form');
    const professionalForm = document.getElementById('professional-form');
    const coupleForm = document.getElementById('couple-form');
    
    // אלמנטים של קוביות
    const personalCube = document.getElementById('personal-forecast');
    const professionalCube = document.getElementById('professional-forecast');
    const coupleCube = document.getElementById('couple-forecast');
    
    // יצירת מאזיני אירועים לקוביות
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
    
    // טיפול בהגשת טפסים
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
    
    // הגדרת אנימציות עבור התיבות
    setupCubeAnimations();
    
    // הגדרת הקובייה והטופס הראשונים כברירת מחדל
    setActiveCube(personalCube);
    showForm(personalForm);
    
    // יצירת כניסות חלקות עבור האלמנטים
    animatePageElements();
});

// פונקציה להצגת הטופס הנבחר והסתרת שאר הטפסים
function showForm(formToShow) {
    const forms = document.querySelectorAll('.forecast-form');
    forms.forEach(form => {
        form.classList.add('hidden');
    });
    
    formToShow.classList.remove('hidden');
    
    // אנימציית הופעה של הטופס
    formToShow.style.opacity = '0';
    setTimeout(() => {
        formToShow.style.opacity = '1';
    }, 50);
}

// פונקציה להגדרת הקובייה הפעילה
function setActiveCube(activeCube) {
    const cubes = document.querySelectorAll('.cube');
    cubes.forEach(cube => {
        cube.classList.remove('active', 'inactive');
        if (cube !== activeCube) {
            cube.classList.add('inactive');
        }
    });
    
    activeCube.classList.add('active');
    activeCube.classList.remove('inactive');
}

// פונקציה לטיפול בהגשת טפסים
function handleFormSubmission(form, type) {
    // איסוף נתונים מהטופס
    const formData = new FormData(form);
    
    // המרה לאובייקט JSON
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // הוספת סוג התחזית
    data.forecastType = type;
    
    // שליחת נתונים לעיבוד בצד שרת
    submitFormData(data);
}

// פונקציה לשליחת נתונים לצד שרת
function submitFormData(data) {
    // לוגיקת בדיקה אם זו התחזית הראשונה או שנדרשת הרשמה
    const isFirstForecast = checkIfFirstForecast();
    
    if (!isFirstForecast && !isUserLoggedIn()) {
        // הצגת טופס ההרשמה אם נדרש
        showRegistrationModal();
        return;
    }
    
    // שמירת נתונים אלו לניתוח בשרת
    console.log('שולח נתונים לשרת:', data);
    
    // סימולציה של בקשת שרת
    showLoadingAnimation();
    
    // סימולציה של תשובה מהשרת אחרי זמן קצר
    setTimeout(() => {
        hideLoadingAnimation();
        // הפנייה לדף התוצאות עם הפרמטרים המתאימים
        navigateToResults(data);
    }, 1500);
}

// פונקציה להצגת אנימציית טעינה
function showLoadingAnimation() {
    // יצירת אלמנט טעינה
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-overlay';
    loadingEl.innerHTML = `
        <div class="loading-spinner"></div>
        <p>מנתח את המספרים שלך...</p>
    `;
    
    document.body.appendChild(loadingEl);
    
    // אנימציית הופעה
    setTimeout(() => {
        loadingEl.style.opacity = '1';
    }, 10);
}

// פונקציה להסתרת אנימציית טעינה
function hideLoadingAnimation() {
    const loadingEl = document.querySelector('.loading-overlay');
    if (loadingEl) {
        loadingEl.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loadingEl);
        }, 300);
    }
}

// פונקציה להגדרת אנימציות לקוביות
function setupCubeAnimations() {
    const cubes = document.querySelectorAll('.cube');
    
    // הוספת אנימציית ריחוף עדינה
    cubes.forEach(cube => {
        // תנועה אקראית קלה מעלה ומטה
        setInterval(() => {
            const randomOffset = Math.random() * 5 - 2.5;
            cube.style.transform = `translateY(${randomOffset}px)`;
        }, 3000);
    });
}

// פונקציה לבדיקה אם זו התחזית הראשונה של המשתמש
function checkIfFirstForecast() {
    // בדיקה בלוקל סטורג' אם המשתמש כבר ביצע תחזית
    return !localStorage.getItem('forecastHistory');
}

// פונקציה לבדיקה אם המשתמש מחובר
function isUserLoggedIn() {
    // בדיקה בלוקל סטורג' אם המשתמש מחובר
    return localStorage.getItem('userLoggedIn') === 'true';
}

// פונקציה להצגת טופס הרשמה
function showRegistrationModal() {
    // יצירת מודל הרשמה
    const modalEl = document.createElement('div');
    modalEl.className = 'registration-modal';
    modalEl.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>הרשמה נדרשת</h2>
            <p>כדי לקבל תחזיות נוספות, נדרשת הרשמה קצרה.</p>
            
            <form id="registration-form">
                <div class="form-group">
                    <label for="reg-name">שם מלא</label>
                    <input type="text" id="reg-name" name="regName" required>
                </div>
                
                <div class="form-group">
                    <label for="reg-email">כתובת אימייל</label>
                    <input type="email" id="reg-email" name="regEmail" required>
                </div>
                
                <div class="form-group">
                    <label for="reg-password">סיסמה</label>
                    <input type="password" id="reg-password" name="regPassword" required>
                </div>
                
                <button type="submit" class="submit-btn">הרשם</button>
            </form>
            
            <div class="login-options">
                <p>או התחבר באמצעות:</p>
                <div class="social-login">
                    <button class="google-login">Google</button>
                    <button class="facebook-login">Facebook</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalEl);
    
    // הוספת מאזיני אירועים לטופס ההרשמה
    setupRegistrationModalEvents(modalEl);
    
    // אנימציית הופעה
    setTimeout(() => {
        modalEl.style.opacity = '1';
    }, 10);
}

// פונקציה להגדרת אירועים לטופס הרשמה
function setupRegistrationModalEvents(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    const form = modal.querySelector('#registration-form');
    const googleBtn = modal.querySelector('.google-login');
    const facebookBtn = modal.querySelector('.facebook-login');
    
    // סגירת המודל
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // הגשת טופס הרשמה
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // סימולציה של הרשמה מוצלחת
        localStorage.setItem('userLoggedIn', 'true');
        
        // סגירת המודל
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
            // המשך עם הגשת התחזית
            submitFormData({});
        }, 300);
    });
    
    // התחברות דרך גוגל
    googleBtn.addEventListener('click', () => {
        simulateSocialLogin('Google');
    });
    
    // התחברות דרך פייסבוק
    facebookBtn.addEventListener('click', () => {
        simulateSocialLogin('Facebook');
    });
}

// פונקציה לסימולציית התחברות חברתית
function simulateSocialLogin(provider) {
    console.log(`מתחבר באמצעות ${provider}...`);
    
    // סימולציה של התחברות מוצלחת
    localStorage.setItem('userLoggedIn', 'true');
    
    // סגירת המודל
    const modal = document.querySelector('.registration-modal');
    modal.style.opacity = '0';
    setTimeout(() => {
        document.body.removeChild(modal);
        // המשך עם הגשת התחזית
        submitFormData({});
    }, 300);
}

// פונקציה לניווט לדף התוצאות
function navigateToResults(data) {
    // יצירת מזהה ייחודי לתחזית
    const forecastId = Date.now().toString();
    
    // שמירת נתוני התחזית בלוקל סטורג'
    saveForecastHistory(forecastId, data);
    
    // בניית כתובת URL עם פרמטרים
    let url = '';
    switch(data.forecastType) {
        case 'personal':
            url = `personal-results.html?id=${forecastId}`;
            break;
        case 'professional':
            url = `professional-results.html?id=${forecastId}`;
            break;
        case 'couple':
            url = `couple-results.html?id=${forecastId}`;
            break;
        default:
            url = `results.html?id=${forecastId}`;
    }
    
    // ניווט לדף התוצאות
    window.location.href = url;
}

// פונקציה לשמירת היסטוריית תחזיות
function saveForecastHistory(id, data) {
    // קבלת היסטוריה קיימת אם קיימת
    let history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
    
    // בדיקה אם הגענו למכסת התחזיות המותרת (3)
    if (history.length >= 3 && !isUserLoggedIn()) {
        // הסרת התחזית הישנה ביותר
        history.shift();
    }
    
    // הוספת התחזית החדשה
    history.push({
        id: id,
        type: data.forecastType,
        date: new Date().toISOString(),
        data: data
    });
    
    // שמירת ההיסטוריה המעודכנת
    localStorage.setItem('forecastHistory', JSON.stringify(history));
}

// פונקציה לאנימציה של אלמנטים בדף הבית
function animatePageElements() {
    const hero = document.querySelector('.hero');
    const forecastSelection = document.querySelector('.forecast-selection');
    const formContainer = document.querySelector('.form-container');
    
    // אנימציות כניסה לאלמנטים
    setTimeout(() => {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        forecastSelection.style.opacity = '1';
        forecastSelection.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 500);
}

// הגדרת סגנונות CSS לאלמנטים דינמיים
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .hero, .forecast-selection, .form-container {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(36, 32, 56, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 5px solid rgba(168, 124, 199, 0.3);
            border-radius: 50%;
            border-top: 5px solid var(--secondary-color);
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .registration-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal-content {
            background-color: var(--bg-dark);
            border-radius: 15px;
            padding: 2rem;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-light);
        }
        
        .social-login {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            justify-content: center;
        }
        
        .social-login button {
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            border: none;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .google-login {
            background-color: #4285F4;
            color: white;
        }
        
        .facebook-login {
            background-color: #3b5998;
            color: white;
        }
        
        .login-options {
            margin-top: 2rem;
            text-align: center;
        }
    </style>
`);
