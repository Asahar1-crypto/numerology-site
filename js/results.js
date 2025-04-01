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
            // כאן השינוי: טעינת נתונים מlocal storage במקום ליצור סימולציה
            const history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
            console.log('היסטוריית תחזיות:', history);
            
            const forecast = history.find(item => item.id === id);
            console.log('תחזית שנמצאה:', forecast);
            
            if (!forecast) {
                // אם לא נמצאה תחזית אמיתית, נשתמש בסימולציה
                console.log('התחזית לא נמצאה, משתמש בסימולציה');
                forecastData = generateMockForecastData(id);
            } else {
                // אם נמצאה תחזית, נשתמש בה
                console.log('נמצאה תחזית בהיסטוריה');
                forecastData = forecast.data;
            }
            
            displayForecastData(forecastData);
            hideLoadingAnimation();
            
        } catch (e) {
            console.error('שגיאה בטעינת נתוני תחזית:', e);
            hideLoadingAnimation();
            showNotification('טעינת הנתונים נכשלה, אנא נסה שנית.', 'error');
        }
    }

    function displayForecastData(data) {
        // עדכון תאריך התחזית
        document.getElementById('forecast-date').textContent = formatDate(new Date());
        
        console.log('מציג נתוני תחזית:', data);
        
        // בדיקה לאיזה מבנה נתונים יש לנו (מAPI או מסימולציה)
        let results;
        if (data.results) {
            // תבנית מAPI של GPT
            results = data.results;
        } else {
            // תבנית מסימולציה
            results = data;
        }
        
        // עדכון מספר גורל והסבר
        const destinyNumber = document.getElementById('destiny-number');
        const destinyExplanation = document.getElementById('destiny-explanation');
        
        // כאן אנחנו בודקים את המבנה של התוצאות ומשתמשים בשדות המתאימים
        if (results.destinyNumber) {
            destinyNumber.textContent = results.destinyNumber;
        } else if (results.destinyNum) { // שם שדה אלטרנטיבי לסימולציה
            destinyNumber.textContent = results.destinyNum;
        }
        
        if (results.destinyExplanation) {
            destinyExplanation.textContent = results.destinyExplanation;
        } else if (results.destinyDesc) { // שם שדה אלטרנטיבי לסימולציה
            destinyExplanation.textContent = results.destinyDesc;
        }
        
        // עדכון מספרי גלגל המספרים
        updateWheelNumbers(results);
        
        // יצירת גלגל המספרים
        createNumerologyWheel(results);
        
        // עדכון תכונות אישיות
        updatePersonalTraits(results);
        
        // עדכון חוזקות ואתגרים
        updateStrengthsAndChallenges(results);
        
        // עדכון המלצות
        updateRecommendations(results);
        
        // אנימציה להופעת האלמנטים
        animateElements();
    }
    
    function updateWheelNumbers(results) {
        // מספר השם
        const expressionNumber = document.getElementById('expression-number');
        if (results.expressionNumber) {
            expressionNumber.textContent = results.expressionNumber;
        } else if (results.nameNumber) { // שם שדה אלטרנטיבי לסימולציה
            expressionNumber.textContent = results.nameNumber;
        }
        
        // מספר האישיות
        const personalityNumber = document.getElementById('personality-number');
        if (results.personalityNumber) {
            personalityNumber.textContent = results.personalityNumber;
        } else if (results.personalityNum) { // שם שדה אלטרנטיבי לסימולציה
            personalityNumber.textContent = results.personalityNum;
        }
        
        // מספר הנפש
        const soulNumber = document.getElementById('soul-number');
        if (results.soulNumber) {
            soulNumber.textContent = results.soulNumber;
        } else if (results.soulNum) { // שם שדה אלטרנטיבי לסימולציה
            soulNumber.textContent = results.soulNum;
        }
        
        // מספר מסלול החיים
        const lifePathNumber = document.getElementById('life-path-number');
        if (results.lifePathNumber) {
            lifePathNumber.textContent = results.lifePathNumber;
        } else if (results.lifePathNum) { // שם שדה אלטרנטיבי לסימולציה
            lifePathNumber.textContent = results.lifePathNum;
        }
    }
    
    function updatePersonalTraits(results) {
        const traitsContainer = document.getElementById('personal-traits');
        traitsContainer.innerHTML = '';
        
        let traits = [];
        
        if (results.personalTraits && Array.isArray(results.personalTraits)) {
            traits = results.personalTraits;
        } else if (results.traits && Array.isArray(results.traits)) { // שם שדה אלטרנטיבי לסימולציה
            traits = results.traits;
        }
        
        traits.forEach(trait => {
            const traitElement = document.createElement('div');
            traitElement.className = 'trait-tag';
            traitElement.textContent = trait;
            traitsContainer.appendChild(traitElement);
        });
    }
    
    function updateStrengthsAndChallenges(results) {
        const strengthsList = document.getElementById('strengths-list');
        const challengesList = document.getElementById('challenges-list');
        
        strengthsList.innerHTML = '';
        challengesList.innerHTML = '';
        
        let strengths = [];
        let challenges = [];
        
        if (results.strengths && Array.isArray(results.strengths)) {
            strengths = results.strengths;
        }
        
        if (results.challenges && Array.isArray(results.challenges)) {
            challenges = results.challenges;
        }
        
        strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
        
        challenges.forEach(challenge => {
            const li = document.createElement('li');
            li.textContent = challenge;
            challengesList.appendChild(li);
        });
    }
    
    function updateRecommendations(results) {
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        
        let recommendations = [];
        
        if (results.recommendations && Array.isArray(results.recommendations)) {
            recommendations = results.recommendations;
        } else if (results.advice && Array.isArray(results.advice)) { // שם שדה אלטרנטיבי לסימולציה
            recommendations = results.advice;
        }
        
        recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            recommendationsList.appendChild(li);
        });
    }

    function createNumerologyWheel(data) {
        const wheelContainer = document.getElementById('numerology-wheel-svg');
        wheelContainer.innerHTML = '';
        
        // יצירת SVG בסיסי
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 300 300');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        
        // יצירת מעגל חיצוני
        const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerCircle.setAttribute('cx', '150');
        outerCircle.setAttribute('cy', '150');
        outerCircle.setAttribute('r', '140');
        outerCircle.setAttribute('fill', 'rgba(36, 32, 56, 0.5)');
        outerCircle.setAttribute('stroke', 'var(--secondary-color)');
        outerCircle.setAttribute('stroke-width', '2');
        svg.appendChild(outerCircle);
        
        // הוספת חלוקה פנימית (4 רבעים)
        const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        horizontalLine.setAttribute('x1', '10');
        horizontalLine.setAttribute('y1', '150');
        horizontalLine.setAttribute('x2', '290');
        horizontalLine.setAttribute('y2', '150');
        horizontalLine.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
        horizontalLine.setAttribute('stroke-width', '1');
        svg.appendChild(horizontalLine);
        
        const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        verticalLine.setAttribute('x1', '150');
        verticalLine.setAttribute('y1', '10');
        verticalLine.setAttribute('x2', '150');
        verticalLine.setAttribute('y2', '290');
        verticalLine.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
        verticalLine.setAttribute('stroke-width', '1');
        svg.appendChild(verticalLine);
        
        // הוספת מעגל מרכזי עם מספר הגורל
        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', '150');
        centerCircle.setAttribute('cy', '150');
        centerCircle.setAttribute('r', '40');
        centerCircle.setAttribute('fill', 'var(--primary-color)');
        svg.appendChild(centerCircle);
        
        // הוספת מספר הגורל במרכז
        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        centerText.setAttribute('x', '150');
        centerText.setAttribute('y', '160');
        centerText.setAttribute('text-anchor', 'middle');
        centerText.setAttribute('fill', 'white');
        centerText.setAttribute('font-size', '28px');
        centerText.setAttribute('font-weight', 'bold');
        
        let destinyNum = '?';
        if (data.destinyNumber) {
            destinyNum = data.destinyNumber;
        } else if (data.destinyNum) {
            destinyNum = data.destinyNum;
        }
        
        centerText.textContent = destinyNum;
        svg.appendChild(centerText);
        
        // הוספת מספרי המשנה מסביב למעגל
        addNumberCircle(svg, 'expression', '#9c27b0', 75, 75, getExpressionNumber(data));
        addNumberCircle(svg, 'personality', '#2196f3', 225, 75, getPersonalityNumber(data));
        addNumberCircle(svg, 'soul', '#ff9800', 75, 225, getSoulNumber(data));
        addNumberCircle(svg, 'life-path', '#4caf50', 225, 225, getLifePathNumber(data));
        
        wheelContainer.appendChild(svg);
    }
    
    function getExpressionNumber(data) {
        return data.expressionNumber || data.nameNumber || '?';
    }
    
    function getPersonalityNumber(data) {
        return data.personalityNumber || data.personalityNum || '?';
    }
    
    function getSoulNumber(data) {
        return data.soulNumber || data.soulNum || '?';
    }
    
    function getLifePathNumber(data) {
        return data.lifePathNumber || data.lifePathNum || '?';
    }
    
    function addNumberCircle(svg, type, color, cx, cy, num) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', '30');
        circle.setAttribute('fill', color);
        svg.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '20px');
        text.setAttribute('font-weight', 'bold');
        text.textContent = num;
        svg.appendChild(text);
    }

    function animateElements() {
        const sections = document.querySelectorAll('.results-content > section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    function checkLoginStatus() {
        isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        
        if (isLoggedIn) {
            loggedInInfo.classList.remove('hidden');
            loggedOutInfo.classList.add('hidden');
            const storedUserName = localStorage.getItem('userName') || 'משתמש';
            userName.textContent = storedUserName;
        } else {
            loggedInInfo.classList.add('hidden');
            loggedOutInfo.classList.remove('hidden');
        }
    }

    function handleLogin() {
        const email = document.getElementById('login-email').value;
        
        // סימולציה של התחברות מוצלחת
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', email.split('@')[0]);
        
        hideModal(loginModal);
        checkLoginStatus();
        showNotification('התחברת בהצלחה!', 'success');
    }

    function handleRegistration() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        
        // סימולציה של הרשמה מוצלחת
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        
        hideModal(registerModal);
        checkLoginStatus();
        showNotification('נרשמת בהצלחה!', 'success');
    }

    function handleLogout() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        
        checkLoginStatus();
        userMenu.classList.remove('active');
        showNotification('התנתקת בהצלחה!', 'success');
    }

    function showModal(modal) {
        modal.classList.add('active');
    }

    function hideModal(modal) {
        modal.classList.remove('active');
    }

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

    function hideLoadingAnimation() {
        const loadingEl = document.querySelector('.loading-overlay');
        if (loadingEl) {
            loadingEl.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loadingEl);
            }, 300);
        }
    }

    function showNotification(message, type = 'info') {
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification ${type}`;
        notificationEl.innerHTML = `<p>${message}</p>`;
        
        document.body.appendChild(notificationEl);
        
        setTimeout(() => {
            notificationEl.style.opacity = '1';
            notificationEl.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notificationEl.style.opacity = '0';
            notificationEl.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                document.body.removeChild(notificationEl);
            }, 300);
        }, 4000);
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('he-IL', options);
    }

    // פונקציה ליצירת תחזית לדוגמה - רק אם אין נתונים אמיתיים
    function generateMockForecastData(id) {
        // הפונקציה הזו תייצר נתונים מגוונים על סמך ה-ID כדי שתחזיות שונות יקבלו תוצאות שונות
        const idNum = parseInt(id.slice(-5)) || 0;
        const destinyNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const selectedNum = destinyNums[idNum % destinyNums.length];
        
        const descriptions = [
            "מספר גורל 1 מסמל מנהיגות, עצמאות ומקוריות. אנשים אלו הם חלוצים טבעיים שלא מפחדים להוביל ולחדש. בעלי ביטחון עצמי ויצירתיות, הם מסוגלים להשיג כל מטרה שיציבו לעצמם.",
            "מספר גורל 2 מסמל שיתוף פעולה, איזון והרמוניה. אנשים אלו הם מתווכים טבעיים ומשתפי פעולה מעולים, עם רגישות ואינטואיציה גבוהה. הם מצטיינים בבניית יחסים ופתרון קונפליקטים.",
            "מספר גורל 3 מסמל יצירתיות, ביטוי עצמי ואופטימיות. אנשים אלו הם תקשורתיים, אמנותיים ומלאי שמחת חיים. הם מפיצים אנרגיה חיובית ומעוררים השראה בסביבתם.",
            "מספר גורל 4 מסמל יציבות, סדר ואמינות. אנשים אלו בונים יסודות איתנים והם בעלי אתיקת עבודה חזקה. אחראיים ומעשיים, הם מצטיינים בתכנון ארוך טווח ובביצוע מדויק.",
            "מספר גורל 5 מסמל חופש, הרפתקנות ושינוי. אנשים אלו אוהבים חוויות חדשות ושואפים לגיוון. סקרנים וורסטיליים, הם מסתגלים במהירות ואוהבים להתנסות בדברים חדשים.",
            "מספר גורל 6 מסמל אחריות, טיפוח והרמוניה בבית. אנשים אלו דואגים לאחרים ומציבים את המשפחה במרכז. הם בעלי חוש צדק מפותח ונוטים לדאוג לסביבתם הקרובה.",
            "מספר גורל 7 מסמל אינטלקט, חקירה ורוחניות. אנשים אלו אנליטיים, מעמיקים ובעלי תפיסה אינטואיטיבית. הם מחפשים ידע ותובנות רוחניות ומתאפיינים בחשיבה עצמאית.",
            "מספר גורל 8 מסמל כוח, שליטה והישגיות חומרית. אנשים אלו שואפים להצלחה ומעריכים ביטחון כלכלי. הם מנהיגים טבעיים בעולם העסקי ובעלי יכולת ארגונית מצוינת.",
            "מספר גורל 9 מסמל הומניטריות, אידיאליזם והארה. אנשים אלו רחבי אופקים, נדיבים ואלטרואיסטים. הם שואפים לתרום לאנושות ולהשאיר חותם משמעותי בעולם."
        ];
        
        const traits = [
            ["מנהיגותי", "יצירתי", "עצמאי", "החלטי", "אמביציוזי"],
            ["דיפלומטי", "רגיש", "אינטואיטיבי", "סבלני", "שיתופי"],
            ["אופטימי", "מלא חיים", "תקשורתי", "אמנותי", "מעורר השראה"],
            ["מעשי", "מאורגן", "אמין", "יסודי", "עקבי"],
            ["הרפתקני", "גמיש", "סקרן", "מגוון", "חופשי"],
            ["אחראי", "נאמן", "מטפח", "צודק", "אוהב"],
            ["אנליטי", "מעמיק", "אינטלקטואלי", "בודד", "אינטואיטיבי"],
            ["שאפתני", "פרקטי", "מצליח", "מארגן", "אוטוריטטיבי"],
            ["אלטרואיסט", "רחב אופקים", "מעורר השראה", "חומל", "אצילי"]
        ];
        
        const strengths = [
            ["ביטחון עצמי גבוה", "יכולת הובלה טבעית", "חשיבה יצירתית"],
            ["אמפתיה עמוקה", "יכולת גישור מצוינת", "אינטואיציה חדה"],
            ["אופטימיות מדבקת", "כישרון אמנותי", "יכולות ביטוי מעולות"],
            ["אמינות ללא פשרות", "יכולת ארגון יוצאת דופן", "התמדה ונחישות"],
            ["יכולת הסתגלות מהירה", "אהבת חיים וריגושים", "יכולת שכנוע טבעית"],
            ["נאמנות ללא גבולות", "חוש צדק מפותח", "יכולת טיפוח והענקה"],
            ["יכולת ניתוח מעמיקה", "חשיבה ביקורתית", "ידע רב תחומי"],
            ["מיקוד במטרה", "תפיסה עסקית מצוינת", "יכולת ניהול משאבים"],
            ["נדיבות אמיתית", "ראייה רחבה", "חמלה כלפי האנושות"]
        ];
        
        const challenges = [
            ["אגוצנטריות יתר", "חוסר סבלנות", "עקשנות מוגזמת"],
            ["הימנעות מעימותים", "תלות יתר באחרים", "רגישות יתר"],
            ["פיזור יתר", "נטייה להתרברבות", "קושי להתמקד"],
            ["נוקשות וקיבעון", "ביקורתיות יתר", "קושי לקבל שינויים"],
            ["קושי להתחייב", "חוסר יציבות", "שעמום מהיר"],
            ["נטייה לביקורתיות", "לקיחת אחריות יתר", "התעייפות מדאגה לאחרים"],
            ["הסתגרות יתר", "ספקנות מוגזמת", "ריחוק רגשי"],
            ["שאפתנות יתר", "אובססיביות לחומר", "קשיחות מוגזמת"],
            ["אידיאליזם יתר", "קושי לסגור מעגלים", "התעלמות מצרכים אישיים"]
        ];
        
        const recommendations = [
            ["פתח את היכולת להקשיב לאחרים", "למד לשתף פעולה בפרויקטים משותפים", "מצא איזון בין מנהיגות לשיתוף פעולה"],
            ["חזק את הביטחון העצמי שלך", "למד להביע את דעתך בבהירות", "הצב גבולות בריאים במערכות יחסים"],
            ["פתח משמעת עצמית ומיקוד", "תרגל הקשבה פעילה", "נצל את היצירתיות שלך בצורה מובנית"],
            ["תרגל גמישות מחשבתית", "אפשר לעצמך יותר ספונטניות", "קבל שינויים כהזדמנות לצמיחה"],
            ["פתח התמדה בפרויקטים ארוכי טווח", "חפש משמעות עמוקה בחוויות", "תרגל מחויבות ואחריות"],
            ["הקדש זמן לטיפול עצמי", "למד לשחרר שליטה", "אפשר לאחרים לקחת אחריות על חייהם"],
            ["פתח את היכולת לשתף רגשות", "השתתף יותר באירועים חברתיים", "איזון בין חשיבה לרגש"],
            ["הקדש זמן לפעילויות ללא מטרה חומרית", "פתח חמלה ורכות", "שתף אחרים בהצלחותיך"],
            ["למד לקבל ולא רק לתת", "התמקד בפרויקטים ממוקדים", "סיים דברים שהתחלת לפני שתתחיל חדשים"]
        ];
        
        // בחירת ערכים לפי מספר הגורל שנבחר
        const idx = selectedNum - 1;
        
        return {
            destinyNum: selectedNum,
            destinyDesc: descriptions[idx],
            nameNumber: ((selectedNum + 1) % 9) || 9,
            personalityNum: ((selectedNum + 3) % 9) || 9,
            soulNum: ((selectedNum + 2) % 9) || 9,
            lifePathNum: ((selectedNum + 4) % 9) || 9,
            traits: traits[idx],
            strengths: strengths[idx],
            challenges: challenges[idx],
            advice: recommendations[idx]
        };
    }
});
