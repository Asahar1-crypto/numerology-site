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
    
    // הדפסת הנתונים לקונסול לבדיקה
    console.log('נתונים שנאספו מהטופס:', data);
    
    // שליחת נתונים לעיבוד
    submitFormData(data);
}

// פונקציה לשליחת נתונים לצד שרת ול-API של GPT
async function submitFormData(data) {
    // לוגיקת בדיקה אם זו התחזית הראשונה או שנדרשת הרשמה
    const isFirstForecast = checkIfFirstForecast();
    
    if (!isFirstForecast && !isUserLoggedIn()) {
        // הצגת טופס ההרשמה אם נדרש
        showRegistrationModal();
        return;
    }
    
    // הצגת אנימציית טעינה
    showLoadingAnimation();
    
    try {
        // יצירת פרומפט מותאם אישית עם הפרטים שהתקבלו
        const prompt = createPromptFromData(data);
        console.log('פרומפט שנוצר:', prompt);
        
        // בדיקה אם יש קישור לשרת אמיתי
        const useRealAPI = false; // שנה את זה ל-true כאשר יש לך שרת אמיתי
        
        let result;
        
        if (useRealAPI) {
            // שליחת בקשה לשרת הביניים שמתקשר עם API של GPT
            const response = await fetch('https://your-backend-url.com/api/forecast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            
            if (!response.ok) {
                throw new Error('שגיאה בתקשורת עם השרת');
            }
            
            result = await response.json();
        } else {
            // סימולציה של תגובה מהשרת
            console.log('משתמש בסימולציה של תגובת שרת');
            result = simulateServerResponse(data);
        }
        
        // עיבוד התוצאה והפקת התחזית
        const forecastId = Date.now().toString();
        
        // יצירת אובייקט תחזית עם כל הנתונים הדרושים
        const forecastData = {
            id: forecastId,
            type: data.forecastType,
            date: new Date().toISOString(),
            userData: data,
            results: useRealAPI ? JSON.parse(result.choices[0].message.content) : result
        };
        
        console.log('נתוני התחזית לשמירה:', forecastData);
        
        // שמירת נתוני התחזית בלוקל סטורג'
        saveForecastHistory(forecastId, forecastData);
        
        // הסתרת אנימציית טעינה
        hideLoadingAnimation();
        
        // ניווט לדף התוצאות המתאים
        navigateToResultsPage(data.forecastType, forecastId);
        
    } catch (error) {
        console.error('שגיאה בשליחת נתונים לשרת:', error);
        hideLoadingAnimation();
        showNotification('אירעה שגיאה בעיבוד התחזית. אנא נסה שנית מאוחר יותר.', 'error');
    }
}

// פונקציה לסימולציה של תגובת שרת (זמנית עד שיהיה API אמיתי)
function simulateServerResponse(data) {
    // חישוב מספר גורל פשוט על סמך השם ותאריך הלידה
    function calculateDestinyNumber(name, dateOfBirth) {
        // חישוב ערך מספרי מהשם - פשוט סכום של הערכים ASCII
        let nameValue = 0;
        for (let i = 0; i < name.length; i++) {
            nameValue += name.charCodeAt(i);
        }
        
        // חישוב ערך מספרי מהתאריך
        const dateValue = dateOfBirth.replace(/\D/g, ''); // להשאיר רק ספרות
        let dateSum = 0;
        for (let i = 0; i < dateValue.length; i++) {
            dateSum += parseInt(dateValue[i]);
        }
        
        // חיבור הערכים וצמצום למספר בין 1-9
        let destinyNum = (nameValue + dateSum) % 9;
        if (destinyNum === 0) destinyNum = 9; // אם השארית היא 0, המספר הוא 9
        
        return destinyNum;
    }
    
    // פונקציית עזר ליצירת מספר כלשהו בין 1-9 על סמך מחרוזת
    function getNumberFromString(str, offset = 0) {
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum += str.charCodeAt(i);
        }
        return ((sum + offset) % 9) || 9;
    }
    
    let response = {};
    
    // מידע משותף לכל סוגי התחזיות
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
    
    switch (data.forecastType) {
        case 'personal': {
            // חישוב מספר הגורל באמצעות הפונקציה שהגדרנו
            const destinyNumber = calculateDestinyNumber(data.name, data.dob);
            const idx = destinyNumber - 1; // אינדקס למערכים (0-8)
            
            // יצירת מספרי משנה מגוונים
            const expressionNumber = getNumberFromString(data.name, 1);
            const personalityNumber = getNumberFromString(data.name, 2);
            const soulNumber = getNumberFromString(data.dob, 3);
            const lifePathNumber = getNumberFromString(data.name + data.dob, 4);
            
            response = {
                destinyNumber: destinyNumber,
                destinyExplanation: descriptions[idx],
                expressionNumber: expressionNumber,
                personalityNumber: personalityNumber,
                soulNumber: soulNumber,
                lifePathNumber: lifePathNumber,
                personalTraits: traits[idx],
                strengths: strengths[idx],
                challenges: challenges[idx],
                recommendations: recommendations[idx]
            };
            break;
        }
        
        case 'professional': {
            // דומה לאישי אך עם תוכן ממוקד לקריירה
            const destinyNumber = calculateDestinyNumber(data.name, data.dob);
            const idx = destinyNumber - 1;
            
            // יצירת מספרי משנה מגוונים
            const expressionNumber = getNumberFromString(data.name, 1);
            const personalityNumber = getNumberFromString(data.name, 2);
            const soulNumber = getNumberFromString(data.dob, 3);
            const lifePathNumber = getNumberFromString(data.name + data.dob, 4);
            
            const professionalDesc = `במישור המקצועי, מספר הגורל ${destinyNumber} מביא איתו ${descriptions[idx].split('.')[0]} בעולם העבודה. אנשים עם מספר זה נוטים להצליח בתפקידים שדורשים ${traits[idx][0].toLowerCase()}, ${traits[idx][1].toLowerCase()} ו${traits[idx][2].toLowerCase()}.`;
            
            response = {
                destinyNumber: destinyNumber,
                destinyExplanation: professionalDesc,
                expressionNumber: expressionNumber,
                personalityNumber: personalityNumber,
                soulNumber: soulNumber,
                lifePathNumber: lifePathNumber,
                personalTraits: traits[idx],
                strengths: strengths[idx],
                challenges: challenges[idx],
                recommendations: recommendations[idx]
            };
            break;
        }
        
        case 'couple': {
            // תחזית זוגית עם אינטגרציה של שני אנשים
            const destinyNumber1 = calculateDestinyNumber(data.name1, data.dob1);
            const destinyNumber2 = calculateDestinyNumber(data.name2, data.dob2);
            const idx1 = destinyNumber1 - 1;
            const idx2 = destinyNumber2 - 1;
            
            // חישוב התאמה זוגית (פשוט לצורך הדגמה)
            const compatibility = ((9 - Math.abs(destinyNumber1 - destinyNumber2)) / 9) * 100;
            const compatibilityScore = Math.round(compatibility);
            
            // תיאור דינמיקה זוגית
            const coupleDesc = `הדינמיקה הזוגית ביניכם מושפעת משילוב של מספרי הגורל ${destinyNumber1} ו-${destinyNumber2}. ${data.name1} מביא/ה לקשר ${traits[idx1][0].toLowerCase()} ו${traits[idx1][1].toLowerCase()}, בעוד ${data.name2} מוסיף/ה ${traits[idx2][0].toLowerCase()} ו${traits[idx2][1].toLowerCase()}. יחד אתם יוצרים איזון מיוחד שמאפשר צמיחה וחיבור עמוק.`;
            
            // שילוב של חוזקות ואתגרים משני בני הזוג
            const coupleStrengths = [
                `שילוב של ${strengths[idx1][0].toLowerCase()} ו${strengths[idx2][0].toLowerCase()}`,
                `איזון בין ${traits[idx1][1].toLowerCase()} ל${traits[idx2][1].toLowerCase()}`,
                `יכולת השלמה הדדית בין בני הזוג`
            ];
            
            const coupleChallenges = [
                `התמודדות עם ${challenges[idx1][0].toLowerCase()} ו${challenges[idx2][0].toLowerCase()}`,
                `מציאת דרך להתמודד עם הניגודים שביניכם`,
                `יצירת מרחב לצמיחה משותפת ואישית`
            ];
            
            const coupleRecommendations = [
                `תקשורת פתוחה במיוחד בנושאים שקשורים ל${traits[idx1][0].toLowerCase()} ו${traits[idx2][0].toLowerCase()}`,
                `הקדישו זמן איכות משותף שמשלב את תחומי העניין של שניכם`,
                `למדו להעריך את ההבדלים ביניכם כמקור לצמיחה ולא כמכשול`
            ];
            
            response = {
                compatibilityScore: compatibilityScore,
                destinyNumber1: destinyNumber1,
                destinyNumber2: destinyNumber2,
                coupleDescription: coupleDesc,
                strengths: coupleStrengths,
                challenges: coupleChallenges,
                recommendations: coupleRecommendations
            };
            break;
        }
    }
    
    console.log('תוצאת סימולציה:', response);
    return response;
}

// פונקציה ליצירת פרומפט מהנתונים
function createPromptFromData(data) {
    let prompt = '';
    
    // בניית פרומפט בהתאם לסוג התחזית
    switch(data.forecastType) {
        case 'personal':
            prompt = `הכן תחזית נומרולוגית אישית עבור השם: ${data.name}, תאריך לידה: ${data.dob}, מגדר: ${data.gender}.
            
            נא לספק את המידע הבא בפורמט JSON:
            {
                "destinyNumber": (מספר הגורל - מספר בין 1-9),
                "destinyExplanation": (הסבר מפורט על משמעות מספר הגורל),
                "expressionNumber": (מספר השם),
                "personalityNumber": (מספר האישיות),
                "soulNumber": (מספר הנפש),
                "lifePathNumber": (מספר מסלול החיים),
                "personalTraits": ["תכונה 1", "תכונה 2", "תכונה 3", "תכונה 4", "תכונה 5"],
                "strengths": ["חוזקה 1", "חוזקה 2", "חוזקה 3"],
                "challenges": ["אתגר 1", "אתגר 2", "אתגר 3"],
                "recommendations": ["המלצה 1", "המלצה 2", "המלצה 3"]
            }
            
            התחזית צריכה להיות מבוססת על העקרונות של נומרולוגיה מערבית והקבלה היהודית.`;
            break;
            
        case 'professional':
            prompt = `הכן תחזית נומרולוגית מקצועית עבור השם: ${data.name}, תאריך לידה: ${data.dob}, מגדר: ${data.gender}.
            
            נא לספק את המידע הבא בפורמט JSON:
            {
                "destinyNumber": (מספר הגורל - מספר בין 1-9),
                "destinyExplanation": (הסבר על משמעות מספר הגורל בקריירה),
                "expressionNumber": (מספר השם),
                "expressionExplanation": (משמעותו בהקשר מקצועי),
                "personalityNumber": (מספר האישיות),
                "personalityExplanation": (השפעתו על יחסי עבודה),
                "lifePathNumber": (מספר מסלול החיים),
                "lifePathExplanation": (כיוון הקריירה המומלץ),
                "careerFields": ["תחום 1", "תחום 2", "תחום 3"],
                "strengths": ["חוזקה 1", "חוזקה 2", "חוזקה 3"],
                "challenges": ["אתגר 1", "אתגר 2", "אתגר 3"],
                "recommendations": ["המלצה 1", "המלצה 2", "המלצה 3"]
            }
            
            התחזית צריכה להיות מבוססת על העקרונות של נומרולוגיה מערבית והקבלה היהודית.`;
            break;
            
        case 'couple':
            prompt = `הכן תחזית נומרולוגית זוגית עבור:
            אדם 1: שם ${data.name1}, תאריך לידה: ${data.dob1}, מגדר: ${data.gender1}
            אדם 2: שם ${data.name2}, תאריך לידה: ${data.dob2}, מגדר: ${data.gender2}
            
            נא לספק את המידע הבא בפורמט JSON:
            {
                "compatibilityScore": (ציון התאמה זוגית - מספר בין 1-100),
                "destinyNumber1": (מספר הגורל של אדם 1),
                "destinyNumber2": (מספר הגורל של אדם 2),
                "coupleDescription": (הסבר על ההתאמה בין מספרי הגורל),
                "strengths": ["חוזק בקשר 1", "חוזק בקשר 2", "חוזק בקשר 3"],
                "challenges": ["אתגר בקשר 1", "אתגר בקשר 2", "אתגר בקשר 3"],
                "recommendations": ["המלצה לחיזוק הקשר 1", "המלצה לחיזוק הקשר 2", "המלצה לחיזוק הקשר 3"],
                "forecast": "תחזית זוגית לשנה הקרובה"
            }
            
            התחזית צריכה להיות מבוססת על העקרונות של נומרולוגיה מערבית והקבלה היהודית.`;
            break;
    }
    
    return prompt;
}

// פונקציה להצגת התראה למשתמש
function showNotification(message, type = 'info') {
    const notificationEl = document.createElement('div');
    notificationEl.className = `notification ${type}`;
    notificationEl.innerHTML = `<p>${message}</p>`;
    
    document.body.appendChild(notificationEl);
    
    // אנימציית הופעה
    setTimeout(() => {
        notificationEl.style.opacity = '1';
        notificationEl.style.transform = 'translateY(0)';
    }, 10);
    
    // הסרה אוטומטית
    setTimeout(() => {
        notificationEl.style.opacity = '0';
        notificationEl.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            document.body.removeChild(notificationEl);
        }, 300);
    }, 4000);
}

// פונקציה לניווט לדף התוצאות
function navigateToResultsPage(type, forecastId) {
    // בניית כתובת URL עם פרמטרים
    let url = '';
    switch(type) {
        case 'personal':
            url = `personal-results.html?id=${forecastId}`;
            break;
        case 'professional':
            url = `professional-results.html?id=${forecastId}`;
            break;
        case 'couple':
            url = `results.html?id=${forecastId}&type=couple`;
            break;
        default:
            url = `results.html?id=${forecastId}`;
    }
    
    // ניווט לדף התוצאות
    window.location.href = url;
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

// פונקציה לשמירת היסטוריית תחזיות
function saveForecastHistory(id, data) {
    // קבלת היסטוריה קיימת אם קיימת
    let history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
    
    // בדיקה אם הגענו למכסת התחזיות המותרת (3)
    if (history.length >= 3 && !isUserLoggedIn()) {
        // הסרת התחזית הישנה ביותר
        history.shift();
    }
    
    console.log('שומר תחזית עם ID:', id);
    
    // הוספת התחזית החדשה - שינוי חשוב: אנחנו מוסיפים את האובייקט המלא, לא רק את הנתונים
    history.push({
        id: id,
        type: data.type || data.forecastType,
        date: new Date().toISOString(),
        data: data // כך אנחנו שומרים את האובייקט המלא
    });
    
    // שמירת ההיסטוריה המעודכנת
    localStorage.setItem('forecastHistory', JSON.stringify(history));
    console.log('היסטוריית תחזיות מעודכנת:', history);
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
        
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-10px);
            background-color: rgba(36, 32, 56, 0.9);
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .notification.info {
            border-right: 4px solid var(--secondary-color);
        }
        
        .notification.success {
            border-right: 4px solid #4caf50;
        }
        
        .notification.error {
            border-right: 4px solid #f44336;
        }
    </style>
`);
