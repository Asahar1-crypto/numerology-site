document.addEventListener('DOMContentLoaded', function() {
    // קבלת מזהה התחזית מכתובת ה-URL
    const urlParams = new URLSearchParams(window.location.search);
    const forecastId = urlParams.get('id');
    const forecastType = urlParams.get('type') || 'personal';

    // אלמנטים בדף
    const forecastTitle = document.getElementById('forecast-title');
    const forecastDate = document.getElementById('forecast-date');
    const destinyNumber = document.getElementById('destiny-number');
    const destinyExplanation = document.getElementById('destiny-explanation');
    const personalTraits = document.getElementById('personal-traits');
    const strengthsList = document.getElementById('strengths-list');
    const challengesList = document.getElementById('challenges-list');
    const recommendationsList = document.getElementById('recommendations-list');
    const expressionNumber = document.getElementById('expression-number');
    const personalityNumber = document.getElementById('personality-number');
    const soulNumber = document.getElementById('soul-number');
    const lifePathNumber = document.getElementById('life-path-number');

    // אלמנטים נוספים בדף
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.querySelector('.user-menu');
    const shareBtn = document.querySelector('.share-btn');
    const printBtn = document.querySelector('.print-btn');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // מאזיני אירועים בסיסיים
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            userMenu.classList.toggle('active');
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', shareForecast);
    }

    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // טעינת נתוני המשתמש והתחזית
    checkLoginStatus();
    
    if (forecastId) {
        loadForecastData(forecastId);
    } else {
        showNotification('לא נמצאה תחזית. מפנה לדף הבית...', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
    }

    // פונקציה לטעינת נתוני תחזית
    function loadForecastData(id) {
        showLoadingAnimation();

        try {
            // ניסיון לטעון את התחזית מהלוקל סטורג'
            const savedForecast = localStorage.getItem(`forecast_${id}`);
            
            if (savedForecast) {
                const forecastData = JSON.parse(savedForecast);
                displayForecastData(forecastData);
                hideLoadingAnimation();
            } else {
                // ניסיון לטעון מההיסטוריה
                const history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
                const historyItem = history.find(item => item.id === id);
                
                if (historyItem && historyItem.data) {
                    displayForecastData(historyItem.data);
                    hideLoadingAnimation();
                } else {
                    // אם לא נמצא, הפניה לדף הבית
                    showNotification('לא נמצאה תחזית. מפנה לדף הבית...', 'error');
                    setTimeout(() => window.location.href = 'index.html', 2000);
                }
            }
        } catch (error) {
            console.error('שגיאה בטעינת נתוני התחזית:', error);
            hideLoadingAnimation();
            showNotification('אירעה שגיאה בטעינת התחזית.', 'error');
        }
    }

    // פונקציה להצגת נתוני התחזית
    function displayForecastData(data) {
        // עדכון כותרת ותאריך
        if (forecastTitle) {
            forecastTitle.textContent = getTitleByType(data.forecastType);
        }
        
        if (forecastDate) {
            forecastDate.textContent = formatDate(new Date());
        }
        
        // עדכון מספר הגורל והסבר
        if (destinyNumber) {
            destinyNumber.textContent = data.destinyNumber || '7';
        }
        
        if (destinyExplanation) {
            destinyExplanation.textContent = data.destinyExplanation || '';
        }
        
        // עדכון מספרי הגלגל הנומרולוגי
        updateNumerologyNumbers(data);
        
        // יצירת הגלגל הנומרולוגי
        createNumerologyWheel(data);
        
        // עדכון תכונות אישיות
        if (personalTraits) {
            updatePersonalTraits(data.traits || []);
        }
        
        // עדכון חוזקות
        if (strengthsList) {
            updateList(strengthsList, data.strengths || []);
        }
        
        // עדכון אתגרים
        if (challengesList) {
            updateList(challengesList, data.challenges || []);
        }
        
        // עדכון המלצות
        if (recommendationsList) {
            updateList(recommendationsList, data.recommendations || []);
        }
        
        // אנימציה של פריטים בדף
        animateElements();
    }

    // פונקציה לעדכון מספרי הגלגל הנומרולוגי
    function updateNumerologyNumbers(data) {
        if (expressionNumber) {
            expressionNumber.textContent = data.expressionNumber || '5';
        }
        
        if (personalityNumber) {
            personalityNumber.textContent = data.personalityNumber || '3';
        }
        
        if (soulNumber) {
            soulNumber.textContent = data.soulNumber || '8';
        }
        
        if (lifePathNumber) {
            lifePathNumber.textContent = data.lifePathNumber || '9';
        }
    }

    // פונקציה ליצירת הגלגל הנומרולוגי
    function createNumerologyWheel(data) {
        const wheelContainer = document.getElementById('numerology-wheel-svg');
        if (!wheelContainer) return;
        
        // יצירת ה-SVG לגלגל הנומרולוגי
        const svgContent = `
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="150" r="145" fill="#242038" stroke="#4a4a4a" stroke-width="2" />
                
                <!-- מספר השם -->
                <circle cx="150" cy="70" r="25" fill="#9c27b0" />
                <text x="150" y="70" text-anchor="middle" dominant-baseline="central" fill="white" font-size="20" font-weight="bold">${data.expressionNumber || '5'}</text>
                <text x="150" y="110" text-anchor="middle" fill="white" font-size="12">מספר השם</text>
                
                <!-- מספר האישיות -->
                <circle cx="230" cy="150" r="25" fill="#2196f3" />
                <text x="230" y="150" text-anchor="middle" dominant-baseline="central" fill="white" font-size="20" font-weight="bold">${data.personalityNumber || '3'}</text>
                <text x="230" y="190" text-anchor="middle" fill="white" font-size="12">אישיות</text>
                
                <!-- מספר הנפש -->
                <circle cx="150" cy="230" r="25" fill="#ff9800" />
                <text x="150" y="230" text-anchor="middle" dominant-baseline="central" fill="white" font-size="20" font-weight="bold">${data.soulNumber || '8'}</text>
                <text x="150" y="270" text-anchor="middle" fill="white" font-size="12">נפש</text>
                
                <!-- מספר מסלול החיים -->
                <circle cx="70" cy="150" r="25" fill="#4caf50" />
                <text x="70" y="150" text-anchor="middle" dominant-baseline="central" fill="white" font-size="20" font-weight="bold">${data.lifePathNumber || '9'}</text>
                <text x="70" y="190" text-anchor="middle" fill="white" font-size="12">מסלול חיים</text>
                
                <!-- מספר הגורל במרכז -->
                <circle cx="150" cy="150" r="40" fill="url(#destinyGradient)" />
                <text x="150" y="150" text-anchor="middle" dominant-baseline="central" fill="white" font-size="30" font-weight="bold">${data.destinyNumber || '7'}</text>
                
                <!-- גרדיאנט למספר הגורל -->
                <defs>
                    <radialGradient id="destinyGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style="stop-color:#a87cc7;" />
                        <stop offset="100%" style="stop-color:#6a0dad;" />
                    </radialGradient>
                </defs>
                
                <!-- קווים מחברים -->
                <line x1="150" y1="95" x2="150" y2="110" stroke="#9c27b0" stroke-width="2" />
                <line x1="205" y1="150" x2="190" y2="150" stroke="#2196f3" stroke-width="2" />
                <line x1="150" y1="205" x2="150" y2="190" stroke="#ff9800" stroke-width="2" />
                <line x1="95" y1="150" x2="110" y2="150" stroke="#4caf50" stroke-width="2" />
            </svg>
        `;
        
        wheelContainer.innerHTML = svgContent;
    }

    // פונקציה לעדכון תכונות אישיות
    function updatePersonalTraits(traits) {
        if (!personalTraits) return;
        
        personalTraits.innerHTML = '';
        
        // אם אין תכונות מוגדרות, השתמש בערכי ברירת מחדל
        if (!traits || traits.length === 0) {
            traits = ['אינטואיטיבי', 'יצירתי', 'הרמוני', 'רגיש', 'אחראי', 'שאפתן', 'מנהיג', 'אנליטי'];
        }
        
        // יצירת אלמנט לכל תכונה
        traits.forEach(trait => {
            const traitElement = document.createElement('div');
            traitElement.className = 'trait-tag';
            traitElement.textContent = trait;
            personalTraits.appendChild(traitElement);
        });
    }

    // פונקציה לעדכון רשימה
    function updateList(listElement, items) {
        if (!listElement) return;
        
        listElement.innerHTML = '';
        
        if (!items || items.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'לא נמצאו נתונים.';
            listElement.appendChild(li);
            return;
        }
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listElement.appendChild(li);
        });
    }

    // פונקציה לפורמט תאריך
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('he-IL', options).format(date);
    }

    // פונקציה לקבלת כותרת לפי סוג התחזית
    function getTitleByType(type) {
        switch(type) {
            case 'personal': return 'התחזית האישית שלך';
            case 'professional': return 'התחזית המקצועית שלך';
            case 'couple': return 'התחזית הזוגית שלך';
            default: return 'התחזית הנומרולוגית שלך';
        }
    }

    // פונקציה לאנימציה של אלמנטים בדף
    // פונקציה לשיתוף התחזית
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

    // פונקציה לבדיקת סטטוס התחברות
    function checkLoginStatus() {
        const loggedInInfo = document.querySelector('.user-info.logged-in');
        const loggedOutInfo = document.querySelector('.user-info.logged-out');
        const userName = document.querySelector('.user-name');
        
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (isLoggedIn && loggedInInfo && loggedOutInfo) {
            loggedInInfo.classList.remove('hidden');
            loggedOutInfo.classList.add('hidden');
            
            // בדיקה אם יש שם משתמש שמור
            const storedName = localStorage.getItem('userName');
            if (userName && storedName) {
                userName.textContent = storedName;
            } else if (userName) {
                userName.textContent = 'אורח';
            }
        } else if (loggedInInfo && loggedOutInfo) {
            loggedInInfo.classList.add('hidden');
            loggedOutInfo.classList.remove('hidden');
        }
    }

    // פונקציה להצגת אנימציית טעינה
    function showLoadingAnimation() {
        // יצירת אלמנט הטעינה אם לא קיים
        if (!document.querySelector('.loading-overlay')) {
            const loadingEl = document.createElement('div');
            loadingEl.className = 'loading-overlay';
            loadingEl.innerHTML = `
                <div class="loading-spinner"></div>
                <p>טוען את התחזית...</p>
            `;
            
            document.body.appendChild(loadingEl);
        }
        
        const loadingEl = document.querySelector('.loading-overlay');
        
        loadingEl.style.display = 'flex';
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
                loadingEl.style.display = 'none';
            }, 300);
        }
    }

    // פונקציה להצגת הודעה למשתמש
    function showNotification(message, type = 'info') {
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification ${type}`;
        notificationEl.textContent = message;
        
        document.body.appendChild(notificationEl);
        
        setTimeout(() => {
            notificationEl.style.opacity = '1';
            notificationEl.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notificationEl.style.opacity = '0';
            notificationEl.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                document.body.removeChild(notificationEl);
            }, 300);
        }, 3000);
    }

    // הוספת סגנונות למצב טעינה והודעות
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
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
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-10px);
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 1100;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
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
        `;
        
        document.head.appendChild(styleElement);
    }

    // הוספת סגנונות
    addStyles();

    function animateElements() {
        const elements = [
            document.querySelector('.destiny-number-section'),
            document.querySelector('.numerology-wheel'),
            document.querySelector('.personal-traits'),
            document.querySelector('.strengths-challenges'),
            document.querySelector('.recommendations')
        ];
        
        elements.forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100 + index * 150);
            }
        });
    }
