document.addEventListener('DOMContentLoaded', function() {
    // משתנים גלובליים
    let forecastData = null;
    let isLoggedIn = false;
    
    // אלמנטים בדף
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
    
    // קבלת מזהה התחזית מה-URL
    const urlParams = new URLSearchParams(window.location.search);
    const forecastId = urlParams.get('id');
    
    // אם יש מזהה תחזית, טען את הנתונים
    if (forecastId) {
        loadForecastData(forecastId);
    } else {
        // אם אין מזהה, הפנה לדף הבית
        window.location.href = 'index.html';
    }
    
    // בדיקה אם המשתמש מחובר
    checkLoginStatus();
    
    // מאזיני אירועים
    
    // תפריט משתמש
    userMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        userMenu.classList.toggle('active');
    });
    
    // סגירת תפריט משתמש בלחיצה בחוץ
    document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target) && e.target !== userMenuBtn) {
            userMenu.classList.remove('active');
        }
    });
    
    // כפתורי התחברות והרשמה
    loginBtn.addEventListener('click', function() {
        showModal(loginModal);
    });
    
    registerBtn.addEventListener('click', function() {
        showModal(registerModal);
    });
    
    // ניווט בין מודלים
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
    
    // סגירת מודלים
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });
    
    // הגשת טופס התחברות
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // הגשת טופס הרשמה
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration();
    });
    
    // כפתור יציאה
    logoutBtn.addEventListener('click', function() {
        handleLogout();
    });
    
    // כפתורי שיתוף והדפסה
    shareBtn.addEventListener('click', function() {
        shareForecast();
    });
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    /**
     * טעינת נתוני התחזית מהשרת
     */
    function loadForecastData(id) {
        // סימולציה של בקשת שרת
        // בפרויקט אמיתי, יש לבצע כאן בקשת AJAX לשרת
        showLoadingAnimation();
        
        setTimeout(() => {
            // סימולציה של תשובה מהשרת
            forecastData = generateMockForecastData(id);
            
            // הצגת הנתונים בממשק
            displayForecastData(forecastData);
            
            hideLoadingAnimation();
        }, 1000);
    }
    
    /**
     * הצגת נתוני התחזית בממשק
     */
    function displayForecastData(data) {
        // עדכון כותרת
        document.getElementById('forecast-title').textContent = data.title;
        
        // עדכון תאריך
        document.getElementById('forecast-date').textContent = formatDate(data.generatedAt);
        
        // מספר הגורל והסבר
        document.getElementById('destiny-number').textContent = data.destinyNumber;
        document.getElementById('destiny-explanation').textContent = data.destinyExplanation;
        
        // עדכון מספרים בגלגל
        document.getElementById('expression-number').textContent = data.expressionNumber;
        document.getElementById('personality-number').textContent = data.personalityNumber;
        document.getElementById('soul-number').textContent = data.soulNumber;
        document.getElementById('life-path-number').textContent = data.lifePathNumber;
        
        // יצירת גלגל נומרולוגי
        createNumerologyWheel(data);
        
        // תכונות אישיות
        const traitsContainer = document.getElementById('personal-traits');
        traitsContainer.innerHTML = '';
        
        data.personalTraits.forEach(trait => {
            const traitTag = document.createElement('div');
            traitTag.className = 'trait-tag';
            traitTag.textContent = trait;
            traitsContainer.appendChild(traitTag);
        });
        
        // חוזקות
        const strengthsList = document.getElementById('strengths-list');
        strengthsList.innerHTML = '';
        
        data.strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
        
        // אתגרים
        const challengesList = document.getElementById('challenges-list');
        challengesList.innerHTML = '';
        
        data.challenges.forEach(challenge => {
            const li = document.createElement('li');
            li.textContent = challenge;
            challengesList.appendChild(li);
        });
        
        // המלצות
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        
        data.recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            recommendationsList.appendChild(li);
        });
        
        // הפעלת אנימציות
        animateElements();
    }
    
    /**
     * יצירת גלגל נומרולוגי
     */
    function createNumerologyWheel(data) {
        const wheelSvg = document.getElementById('numerology-wheel-svg');
        
        // יצירת SVG
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 300 300");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        
        // הגדרת צבעים לכל מספר
        const colors = {
            expressionNumber: "#9c27b0",
            personalityNumber: "#2196f3",
            soulNumber: "#ff9800",
            lifePathNumber: "#4caf50",
            destinyNumber: "#e91e63"
        };
        
        // יצירת עיגול רקע
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", "150");
        circle.setAttribute("cy", "150");
        circle.setAttribute("r", "140");
        circle.setAttribute("fill", "rgba(30, 25, 50, 0.8)");
        circle.setAttribute("stroke", "#6a0dad");
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);
        
        // יצירת קווי חלוקה
        for (let i = 0; i < 9; i++) {
            const line = document.createElementNS(svgNS, "line");
            const angle = (i * 40) * Math.PI / 180;
            const x1 = 150 + 50 * Math.cos(angle);
            const y1 = 150 + 50 * Math.sin(angle);
            const x2 = 150 + 140 * Math.cos(angle);
            const y2 = 150 + 140 * Math.sin(angle);
            
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("stroke", "rgba(255, 255, 255, 0.3)");
            line.setAttribute("stroke-width", "1");
            svg.appendChild(line);
        }
        
        // יצירת עיגול מרכזי למספר הגורל
        const innerCircle = document.createElementNS(svgNS, "circle");
        innerCircle.setAttribute("cx", "150");
        innerCircle.setAttribute("cy", "150");
        innerCircle.setAttribute("r", "50");
        innerCircle.setAttribute("fill", colors.destinyNumber);
        innerCircle.setAttribute("opacity", "0.7");
        svg.appendChild(innerCircle);
        
        // הוספת מספר הגורל המרכזי
        const destinyText = document.createElementNS(svgNS, "text");
        destinyText.setAttribute("x", "150");
        destinyText.setAttribute("y", "158");
        destinyText.setAttribute("text-anchor", "middle");
        destinyText.setAttribute("font-size", "30");
        destinyText.setAttribute("fill", "white");
        destinyText.setAttribute("font-weight", "bold");
        destinyText.textContent = data.destinyNumber;
        svg.appendChild(destinyText);
        
        // הוספת מספרים מסביב למעגל
        const numbers = [
            { name: "expressionNumber", value: data.expressionNumber, angle: 0 },
            { name: "personalityNumber", value: data.personalityNumber, angle: 90 },
            { name: "soulNumber", value: data.soulNumber, angle: 180 },
            { name: "lifePathNumber", value: data.lifePathNumber, angle: 270 }
        ];
        
        numbers.forEach(number => {
            const angle = number.angle * Math.PI / 180;
            const x = 150 + 95 * Math.cos(angle);
            const y = 150 + 95 * Math.sin(angle);
            
            // יצירת עיגול קטן עבור המספר
            const numCircle = document.createElementNS(svgNS, "circle");
            numCircle.setAttribute("cx", x);
            numCircle.setAttribute("cy", y);
            numCircle.setAttribute("r", "25");
            numCircle.setAttribute("fill", colors[number.name]);
            numCircle.setAttribute("opacity", "0.8");
            svg.appendChild(numCircle);
            
            // הוספת המספר עצמו
            const numText = document.createElementNS(svgNS, "text");
            numText.setAttribute("x", x);
            numText.setAttribute("y", y + 5);
            numText.setAttribute("text-anchor", "middle");
            numText.setAttribute("font-size", "18");
            numText.setAttribute("fill", "white");
            numText.setAttribute("font-weight", "bold");
            numText.textContent = number.value;
            svg.appendChild(numText);
        });
        
        // הוספת קווי חיבור למספר הגורל
        numbers.forEach(number => {
            const angle = number.angle * Math.PI / 180;
            const x = 150 + 95 * Math.cos(angle);
            const y = 150 + 95 * Math.sin(angle);
            
            const connector = document.createElementNS(svgNS, "line");
            connector.setAttribute("x1", "150");
            connector.setAttribute("y1", "150");
            connector.setAttribute("x2", x);
            connector.setAttribute("y2", y);
            connector.setAttribute("stroke", colors[number.name]);
            connector.setAttribute("stroke-width", "3");
            connector.setAttribute("opacity", "0.6");
            svg.appendChild(connector);
        });
        
        // הוספת ה-SVG לדף
        wheelSvg.innerHTML = '';
        wheelSvg.appendChild(svg);
    }
    
    /**
     * אנימציה לאלמנטים בדף
     */
    function animateElements() {
        // אנימציית הופעה לאלמנטים
        const sectionsToAnimate = [
            '.destiny-number-section',
            '.numerology-wheel',
            '.personal-traits',
            '.strengths-challenges',
            '.recommendations'
        ];
        
        sectionsToAnimate.forEach((selector, index) => {
            const section = document.querySelector(selector);
            if (section) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 300 + (index * 200));
            }
        });
    }
    
    /**
     * בדיקת סטטוס התחברות המשתמש
     */
    function checkLoginStatus() {
        // בדיקה אם יש פרטי התחברות בלוקל סטורג'
        const userId = localStorage.getItem('userId');
        const userNameStr = localStorage.getItem('userName');
        
        if (userId && userNameStr) {
            // המשתמש מחובר
            isLoggedIn = true;
            userName.textContent = userNameStr;
            loggedInInfo.classList.remove('hidden');
            loggedOutInfo.classList.add('hidden');
        } else {
            // המשתמש לא מחובר
            isLoggedIn = false;
            loggedInInfo.classList.add('hidden');
            loggedOutInfo.classList.remove('hidden');
        }
    }
    
    /**
     * טיפול בהתחברות משתמש
     */
    function handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // סימולציה של בקשת התחברות לשרת
        // בפרויקט אמיתי, יש לבצע כאן בקשת AJAX לשרת
        
        // לצורך הדגמה, ניצור התחברות מדומה
        setTimeout(() => {
            localStorage.setItem('userId', 'mockUser123');
            localStorage.setItem('userName', email.split('@')[0]);
            
            hideModal(loginModal);
            checkLoginStatus();
            
            // הצגת הודעת הצלחה
            showNotification('התחברת בהצלחה!', 'success');
        }, 1000);
    }
    
    /**
     * טיפול בהרשמת משתמש
     */
    function handleRegistration() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        // סימולציה של בקשת הרשמה לשרת
        // בפרויקט אמיתי, יש לבצע כאן בקשת AJAX לשרת
        
        // לצורך הדגמה, ניצור הרשמה מדומה
        setTimeout(() => {
            localStorage.setItem('userId', 'mockUser123');
            localStorage.setItem('userName', name);
            
            hideModal(registerModal);
            checkLoginStatus();
            
            // הצגת הודעת הצלחה
            showNotification('נרשמת בהצלחה!', 'success');
        }, 1000);
    }
    
    /**
     * טיפול ביציאת משתמש
     */
    function handleLogout() {
        // מחיקת פרטי ההתחברות מהלוקל סטורג'
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        
        // עדכון הממשק
        checkLoginStatus();
        userMenu.classList.remove('active');
        
        // הצגת הודעת הצלחה
        showNotification('התנתקת בהצלחה!', 'success');
    }
    
    /**
     * שיתוף התחזית
     */
    function shareForecast() {
        if (navigator.share) {
            navigator.share({
                title: 'תחזית נומרולוגית אישית',
                text: 'הנה התחזית הנומרולוגית האישית שלי!',
                url: window.location.href
            })
            .then(() => console.log('שותף בהצלחה'))
            .catch((error) => console.log('שגיאה בשיתוף:', error));
        } else {
            // אם API השיתוף אינו נתמך
            const shareUrl = window.location.href;
            prompt('העתק את הקישור הבא לשיתוף התחזית:', shareUrl);
        }
    }
    
    /**
     * הצגת מודל
     */
    function showModal(modal) {
        modal.classList.add('active');
    }
    
    /**
     * הסתרת מודל
     */
    function hideModal(modal) {
        modal.classList.remove('active');
    }
    
    /**
     * הצגת אנימציית טעינה
     */
    function showLoadingAnimation() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-spinner"></div>
            <p>טוען את התחזית שלך...</p>
        `;
        
        document.body.appendChild(loadingEl);
        
        setTimeout(() => {
            loadingEl.style.opacity = '1';
        }, 10);
    }
    
    /**
     * הסתרת אנימציית טעינה
     */
    function hideLoadingAnimation() {
        const loadingEl = document.querySelector('.loading-overlay');
        if (loadingEl) {
            loadingEl.style.opacity = '0';
            setTimeout(() => {
                loadingEl.parentNode.removeChild(loadingEl);
            }, 300);
        }
    }
    
    /**
     * הצגת הודעה למשתמש
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.parentNode.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    /**
     * עיצוב תאריך
     */
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    /**
     * יצירת מידע תחזית לצורכי הדגמה
     */
    function generateMockForecastData(id) {
        return {
            id: id,
            title: "התחזית האישית של ישראל ישראלי",
            generatedAt: new Date().toString(),
            destinyNumber: 7,
            destinyExplanation: "מספר הגורל 7 מסמל חכמה, רוחניות וניתוח. אנשים עם מספר גורל 7 הם עמוקים, אינטלקטואליים ובעלי נטייה להתבוננות פנימית. הם מצטיינים במחקר, ניתוח ובחיפוש אחר משמעות עמוקה יותר בחיים. האתגר העיקרי שלהם הוא לא להתנתק מדי מהעולם החברתי ולמצוא איזון בין פנימיות לחיצוניות.",
            expressionNumber: 5,
            personalityNumber: 4,
            soulNumber: 9,
            lifePathNumber: 3,
            personalTraits: [
                "אינטלקטואליות",
                "ניתוח",
                "אינטרוספקציה",
                "רוחניות",
                "חכמה",
                "סקרנות",
                "מעמיקות"
            ],
            strengths: [
                "חשיבה אנליטית עמוקה",
                "תפיסה רוחנית ופילוסופית",
                "חכמה ותובנות",
                "יכולת התבוננות פנימית"
            ],
            challenges: [
                "התבודדות והתנתקות",
                "ביקורתיות מוגזמת",
                "ספקנות יתר",
                "ניתוח יתר ופרפקציוניזם"
            ],
            recommendations: [
                "צור איזון בין התבוננות פנימית לפעילות חברתית",
                "תרגם את הידע שלך לפעולות מעשיות",
                "שתף אחרים במחשבותיך ותובנותיך",
                "פתח אמון בעולם ובאחרים"
            ]
        };
    }
    
    // הוספת CSS לאנימציית טעינה והודעות
    document.head.insertAdjacentHTML('beforeend', `
        <style>
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
            
            .notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            
            .notification.success {
                background-color: #4caf50;
            }
            
            .notification.error {
                background-color: #f44336;
            }
            
            .notification.info {
                background-color: #2196f3;
            }
        </style>
    `);
});