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
    const forecastType = urlParams.get('type') || 'personal'; // ברירת מחדל אישי

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

    // פונקציה לטעינת נתוני התחזית
    function loadForecastData(id) {
        showLoadingAnimation();

        try {
            // ניסיון לקבל היסטוריה מהלוקל סטורג'
            let history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
            let savedForecast = history.find(item => item.id === id);

            if (savedForecast) {
                // אם נמצא במאגר, להשתמש בו
                setTimeout(() => {
                    forecastData = savedForecast.data;
                    displayForecastData(forecastData);
                    hideLoadingAnimation();
                }, 500);
            } else {
                // אם לא נמצא, לייצר חדש
                setTimeout(() => {
                    forecastData = generateMockForecastData(id);
                    displayForecastData(forecastData);
                    hideLoadingAnimation();
                }, 1000);
            }
        } catch (e) {
            console.error('Error loading forecast data:', e);
            hideLoadingAnimation();
            showNotification('טעינת הנתונים נכשלה, אנא נסה שנית.', 'error');
        }
    }

    // פונקציה להצגת נתוני התחזית בדף
    function displayForecastData(data) {
        try {
            // עדכון כותרת הדף
            document.getElementById('forecast-title').textContent = getTitleByType(data.forecastType);
            
            // עדכון תאריך
            const forecastDateElement = document.getElementById('forecast-date');
            if (forecastDateElement) {
                forecastDateElement.textContent = formatDate(new Date());
            }
            
            // עדכון מספר הגורל
            const destinyNumberElement = document.getElementById('destiny-number');
            if (destinyNumberElement) {
                destinyNumberElement.textContent = data.destinyNumber || '7';
            }
            
            // עדכון הסבר מספר הגורל
            const destinyExplanationElement = document.getElementById('destiny-explanation');
            if (destinyExplanationElement) {
                destinyExplanationElement.textContent = getDestinyExplanation(data.destinyNumber);
            }
            
            // עדכון מספרי הגלגל
            updateNumerologyNumbers(data);
            
            // יצירת הגלגל הנומרולוגי
            createNumerologyWheel(data);
            
            // עדכון תכונות אישיות
            updatePersonalTraits(data.traits);
            
            // עדכון חוזקות
            updateStrengths(data.strengths);
            
            // עדכון אתגרים
            updateChallenges(data.challenges);
            
            // עדכון המלצות
            updateRecommendations(data.recommendations);
            
            // אנימציה של תוצאות
            animateElements();
        } catch (error) {
            console.error('Error displaying forecast data:', error);
            showNotification('אירעה שגיאה בהצגת הנתונים. אנא טען מחדש את הדף.', 'error');
        }
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

    // פונקציה לעדכון מספרי הגלגל הנומרולוגי
    function updateNumerologyNumbers(data) {
        const expressionNumber = document.getElementById('expression-number');
        const personalityNumber = document.getElementById('personality-number');
        const soulNumber = document.getElementById('soul-number');
        const lifePathNumber = document.getElementById('life-path-number');
        
        if (expressionNumber) expressionNumber.textContent = data.expressionNumber || '5';
        if (personalityNumber) personalityNumber.textContent = data.personalityNumber || '3';
        if (soulNumber) soulNumber.textContent = data.soulNumber || '8';
        if (lifePathNumber) lifePathNumber.textContent = data.lifePathNumber || '9';
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
    function updatePersonalTraits(traits = []) {
        const traitsContainer = document.getElementById('personal-traits');
        if (!traitsContainer) return;
        
        if (!traits || traits.length === 0) {
            // נתונים לדוגמה אם אין נתונים אמיתיים
            traits = ['אינטואיטיבי', 'יצירתי', 'הרמוני', 'רגיש', 'אחראי', 'שאפתן', 'מנהיג', 'אנליטי', 'אמיץ'];
        }
        
        traitsContainer.innerHTML = '';
        
        traits.forEach(trait => {
            const traitElement = document.createElement('div');
            traitElement.className = 'trait-tag';
            traitElement.textContent = trait;
            traitsContainer.appendChild(traitElement);
        });
    }

    // פונקציה לעדכון חוזקות
    function updateStrengths(strengths = []) {
        const strengthsList = document.getElementById('strengths-list');
        if (!strengthsList) return;
        
        if (!strengths || strengths.length === 0) {
            // נתונים לדוגמה
            strengths = [
                'יכולת התבוננות עמוקה',
                'חשיבה מחוץ לקופסה',
                'קשר חזק לאינטואיציה',
                'יכולת הכלה רגשית גבוהה',
                'כישורי מנהיגות טבעיים'
            ];
        }
        
        strengthsList.innerHTML = '';
        
        strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
    }

    // פונקציה לעדכון אתגרים
    function updateChallenges(challenges = []) {
        const challengesList = document.getElementById('challenges-list');
        if (!challengesList) return;
        
        if (!challenges || challenges.length === 0) {
            // נתונים לדוגמה
            challenges = [
                'נטייה לביקורתיות יתר',
                'קושי להתפשר',
                'רגישות יתר למצבים חברתיים',
                'נטייה להתבודדות בזמני לחץ',
                'קושי לקבל ביקורת'
            ];
        }
        
        challengesList.innerHTML = '';
        
        challenges.forEach(challenge => {
            const li = document.createElement('li');
            li.textContent = challenge;
            challengesList.appendChild(li);
        });
    }

    // פונקציה לעדכון המלצות
    function updateRecommendations(recommendations = []) {
        const recommendationsList = document.getElementById('recommendations-list');
        if (!recommendationsList) return;
        
        if (!recommendations || recommendations.length === 0) {
            // נתונים לדוגמה
            recommendations = [
                'השנה מתאימה להתמקד בהתפתחות אישית ולמידה של מיומנויות חדשות.',
                'חודש אוקטובר יהיה מתאים במיוחד להתחלות חדשות בתחום המקצועי.',
                'הקדש זמן איכות ליקיריך במהלך החודשים הקרובים.',
                'תרגול מדיטציה או פעילות רוחנית תסייע לאזן את האנרגיות שלך.',
                'שים לב לאינטואיציה שלך בקבלת החלטות כלכליות בתקופה הקרובה.'
            ];
        }
        
        recommendationsList.innerHTML = '';
        
        recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            recommendationsList.appendChild(li);
        });
    }

    // פונקציה להנפשת אלמנטים בדף התוצאות
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
        isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (isLoggedIn) {
            // אם המשתמש מחובר
            loggedInInfo.classList.remove('hidden');
            loggedOutInfo.classList.add('hidden');
            
            // בדיקה אם יש שם משתמש שמור
            const storedName = localStorage.getItem('userName');
            if (userName && storedName) {
                userName.textContent = storedName;
            } else if (userName) {
                userName.textContent = 'אורח';
            }
        } else {
            // אם המשתמש לא מחובר
            loggedInInfo.classList.add('hidden');
            loggedOutInfo.classList.remove('hidden');
        }
    }

    // פונקציה לטיפול בהתחברות
    function handleLogin() {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        
        if (!emailInput || !passwordInput) return;
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            showNotification('אנא מלא את כל השדות.', 'error');
            return;
        }
        
        // סימולציה של התחברות מוצלחת
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', email.split('@')[0]); // לוקחים את החלק לפני @ כשם המשתמש
        
        hideModal(loginModal);
        showNotification('התחברת בהצלחה!', 'success');
        
        // עדכון הממשק
        checkLoginStatus();
    }

    // פונקציה לטיפול בהרשמה
    function handleRegistration() {
        const nameInput = document.getElementById('register-name');
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        
        if (!nameInput || !emailInput || !passwordInput) return;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!name || !email || !password) {
            showNotification('אנא מלא את כל השדות.', 'error');
            return;
        }
        
        // סימולציה של הרשמה מוצלחת
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        
        hideModal(registerModal);
        showNotification('נרשמת בהצלחה!', 'success');
        
        // עדכון הממשק
        checkLoginStatus();
    }

    // פונקציה לטיפול בהתנתקות
    function handleLogout() {
        // מסירים את נתוני ההתחברות
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // עדכון הממשק
        checkLoginStatus();
        
        showNotification('התנתקת בהצלחה!', 'info');
    }

    // פונקציה לשמירת היסטוריית תחזיות
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

    // פונקציה להצגת חלונית
    function showModal(modal) {
        if (!modal) return;
        
        modal.classList.add('active');
    }

    // פונקציה להסתרת חלונית
    function hideModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
    }

    // פונקציה להצגת אנימציית טעינה
    function showLoadingAnimation() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-spinner"></div>
            <p>טוען את התחזית...</p>
        `;
        
        document.body.appendChild(loadingEl);
        
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

    // פונקציה לפורמט תאריך
    function formatDate(date) {
        if (!date) return '';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('he-IL', options).format(date);
    }

    // פונקציה לקבלת הסבר למספר גורל
    function getDestinyExplanation(number) {
        const explanations = {
            '1': 'אתה מיועד להיות מנהיג ולהוביל אחרים. עם יכולת משופרת ליצור מציאות חדשה, עליך להתמקד בעצמאות, בטחון עצמי, ויזמות. אתה חלוץ טבעי ויש לך את הכוח להגשים כל רעיון שתבחר.',
            
            '2': 'את מוצאת הרמוניה באינטראקציות אנושיות ושיתופי פעולה. עם רגישות גבוהה ואינטואיציה חדה, יש לך יכולת לאזן ולתווך. תפקידך הוא לחבר בין אנשים ולבנות שלום.',
            
            '3': 'האנרגיה היצירתית שלך זורמת בחופשיות. כבעל/ת מספר גורל 3, יש לך כישרון בביטוי עצמי ויכולת להעביר רעיונות באופן מרתק. מטרתך היא לשתף את האמת שלך עם העולם דרך אמנות, כתיבה או דיבור.',
            
            '4': 'הייעוד שלך קשור בבניית מסגרות יציבות וארוכות טווח. את/ה אדם אמין וקשה-עבודה המביא סדר לכאוס. המשימה שלך בחיים היא לבנות יסודות מוצקים לעצמך ולאחרים.',
            
            '5': 'נולדת להיות חופשי ולחקור את העולם. כבעל/ת מספר גורל 5, את/ה מונע/ת על ידי סקרנות והרפתקנות. תפקידך הוא לחוות את החיים במלואם ולהתאים עצמך לשינויים בקלות.',
            
            '6': 'יש לך תחושת אחריות מולדת וצורך לטפל באחרים. אתה מביא אהבה ללא תנאי ורצון לשרת. תפקידך הוא ליצור הרמוניה בבית ובקהילה ולהיות אור מנחה לאחרים.',
            
            '7': 'אתה נשמה חוקרת במסע רוחני. כבעל מספר גורל 7, יש לך תודעה אנליטית ורצון לגלות את האמת. תפקידך הוא לחפש ידע, להגיע להארה רוחנית, ולשתף את חוכמתך עם אחרים.',
            
            '8': 'נולדת להשיג עוצמה והצלחה חומרית. יש לך הבנה אינטואיטיבית של כוח ויכולת לממש חזון גדול. תפקידך הוא לשגשג כדי להשפיע לטובה ולהשתמש במשאביך כדי לעזור לאחרים.',
            
            '9': 'אתה אדם הומניטרי עם אמפתיה גבוהה. כבעל מספר גורל 9, יש לך תשוקה לצדק חברתי ושיפור המצב האנושי. תפקידך הוא להשפיע על מספר גדול של אנשים ולהביא שינוי חיובי.'
        };
        
        return explanations[number] || 'מספר הגורל שלך מכיל את המיסטיקה והחכמה היקומית שמלווה אותך בכל צעד בחייך. הוא מגלה את הפוטנציאל הגדול והאתגרים שעליך להתגבר עליהם בדרך להגשמת הייעוד שלך.';
    }

    // פונקציה ליצירת נתוני תחזית לדוגמה
    function generateMockForecastData(id) {
        // מספרים אקראיים עבור נתוני המשתמש
        const destinyNumber = String(Math.floor(Math.random() * 9) + 1);
        const expressionNumber = String(Math.floor(Math.random() * 9) + 1);
        const personalityNumber = String(Math.floor(Math.random() * 9) + 1);
        const soulNumber = String(Math.floor(Math.random() * 9) + 1);
        const lifePathNumber = String(Math.floor(Math.random() * 9) + 1);
        
        // מאגרי תכונות אישיות לפי סוג התחזית
        const personalTraits = [
            'אינטואיטיבי', 'יצירתי', 'רגיש', 'אחראי', 'שאפתן', 'מנהיג', 'אנליטי', 
            'אמיץ', 'סבלני', 'נדיב', 'אופטימי', 'הרפתקן', 'רגוע', 'מתחשב'
        ];
        
        const professionalTraits = [
            'מוכוון מטרה', 'חדשני', 'אסטרטגי', 'מתמיד', 'יעיל', 'מקצועי', 'מאורגן', 
            'יוזם', 'החלטי', 'מנהיגותי', 'אנליטי', 'יצירתי', 'מתקשר היטב', 'פותר בעיות'
        ];
        
        const coupleTraits = [
            'אמפתי', 'תומך', 'מסור', 'אוהב', 'סבלני', 'פתוח', 'מתקשר היטב', 
            'נאמן', 'גמיש', 'סלחן', 'רומנטי', 'משתף פעולה', 'מבין', 'מאוזן'
        ];
        
        // בחירת 6-8 תכונות אקראיות
        function getRandomTraits(traitPool) {
            const shuffledTraits = [...traitPool].sort(() => 0.5 - Math.random());
            return shuffledTraits.slice(0, Math.floor(Math.random() * 3) + 6);
        }
        
        // בחירת מאגר תכונות לפי סוג התחזית
        let traitPool;
        let forecastType = urlParams.get('type') || 'personal';
        
        switch(forecastType) {
            case 'professional':
                traitPool = professionalTraits;
                break;
            case 'couple':
                traitPool = coupleTraits;
                break;
            default:
                traitPool = personalTraits;
                forecastType = 'personal';
        }
        
        // חוזקות ואתגרים אקראיים
        const allStrengths = [
            'יכולת התבוננות עמוקה',
            'חשיבה מחוץ לקופסה',
            'קשר חזק לאינטואיציה',
            'יכולת הכלה רגשית גבוהה',
            'כישורי מנהיגות טבעיים',
            'התמדה יוצאת דופן',
            'אמפתיה וחמלה',
            'תקשורת ברורה וישירה',
            'יצירתיות ודמיון עשיר',
            'יכולת ניתוח מעמיקה',
            'כושר ארגון וסדר',
            'אופטימיות ותקווה'
        ];
        
        const allChallenges = [
            'נטייה לביקורתיות יתר',
            'קושי להתפשר',
            'רגישות יתר למצבים חברתיים',
            'נטייה להתבודדות בזמני לחץ',
            'קושי לקבל ביקורת',
            'נטייה לדחיינות',
            'קושי לבטא רגשות',
            'נטייה לשיפוטיות',
            'קושי לשמור על איזון',
            'נטייה לוותר מהר מדי',
            'חשש מכישלון',
            'קושי להציב גבולות'
        ];
        
        // המלצות אקראיות
        const allRecommendations = [
            'השנה מתאימה להתמקד בהתפתחות אישית ולמידה של מיומנויות חדשות.',
            'חודש אוקטובר יהיה מתאים במיוחד להתחלות חדשות בתחום המקצועי.',
            'הקדש זמן איכות ליקיריך במהלך החודשים הקרובים.',
            'תרגול מדיטציה או פעילות רוחנית תסייע לאזן את האנרגיות שלך.',
            'שים לב לאינטואיציה שלך בקבלת החלטות כלכליות בתקופה הקרובה.',
            'שיתוף פעולה עם אנשים בעלי מספר גורל 4 או 8 יכול להביא להזדמנויות חדשות.',
            'זהו זמן טוב להתחיל בפרויקט יצירתי שתמיד רצית לעשות.',
            'חפש הזדמנויות ללימוד נושאים הקשורים לתחומי העניין האותנטיים שלך.',
            'בחודשים נובמבר-דצמבר, הקדש תשומת לב מיוחדת לבריאותך.',
            'מערכות יחסים חדשות שיתחילו בחציון השני של השנה יישאו פוטנציאל משמעותי.',
            'צפה להזדמנות להתקדמות מקצועית בין החודשים מרץ ליוני.',
            'השנה מציעה הזדמנות מצוינת לשחרר דפוסים ישנים שאינם משרתים אותך עוד.'
        ];
        
        // בחירת פריטים אקראיים
        function getRandomItems(array, count) {
            return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
        }
        
        // יצירת אובייקט התחזית
        return {
            id: id,
            forecastType: forecastType,
            destinyNumber: destinyNumber,
            expressionNumber: expressionNumber,
            personalityNumber: personalityNumber,
            soulNumber: soulNumber,
            lifePathNumber: lifePathNumber,
            traits: getRandomTraits(traitPool),
            strengths: getRandomItems(allStrengths, 5),
            challenges: getRandomItems(allChallenges, 5),
            recommendations: getRandomItems(allRecommendations, 5)
        };
    }

    // הוספת סגנונות למצב טעינה והודעות
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
            
            /* אנימציה לאלמנטים */
            .destiny-number-section, .numerology-wheel, .personal-traits, 
            .strengths-challenges, .recommendations {
                opacity: 0;
                transform: translateY(20px);
            }
        </style>
    `);
});
