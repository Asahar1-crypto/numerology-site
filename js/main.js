document.addEventListener('DOMContentLoaded', function() {
    // אתחול שירות הנומרולוגיה
    // יש להחליף את 'YOUR_OPENAI_API_KEY' במפתח האמיתי שלך
    const numerologyService = new NumerologyService('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');
    
    // הוספת אנימציית טעינה וסגנונות נוספים
    addStyles();
    
    // הוספת אלמנט טעינה
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-overlay';
    loadingElement.innerHTML = `
        <div class="loading-spinner"></div>
        <p>מפענחים את הקוד הנומרולוגי שלך...</p>
    `;
    document.body.appendChild(loadingElement);
    
    // אלמנטים של טפסים
    const personalForm = document.getElementById('personal-form');
    const professionalForm = document.getElementById('professional-form');
    const coupleForm = document.getElementById('couple-form');
    
    // אלמנטים של קוביות
    const personalCube = document.getElementById('personal-cube');
    const professionalCube = document.getElementById('professional-cube');
    const coupleCube = document.getElementById('couple-cube');
    
    // פונקציה להצגת הטופס הנבחר והסתרת שאר הטפסים
    function showForm(formToShow) {
        // הסתרת כל הטפסים תחילה
        personalForm.style.display = 'none';
        professionalForm.style.display = 'none';
        coupleForm.style.display = 'none';
        
        // הצגת הטופס שנבחר
        formToShow.style.display = 'block';
    }
    
    // פונקציה להגדרת הקובייה הפעילה
    function setActiveCube(activeCube) {
        // איפוס סטטוס הקוביות
        personalCube.classList.remove('active');
        professionalCube.classList.remove('active');
        coupleCube.classList.remove('active');
        
        // הגדרת הקובייה הנבחרת כפעילה
        activeCube.classList.add('active');
    }
    
    // הגדרת מאזיני אירועים לקוביות
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
    
    // פונקציה להצגת אנימציית טעינה
    function showLoadingIndicator() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.opacity = '1';
        }
    }
    
    // פונקציה להסתרת אנימציית טעינה
    function hideLoadingIndicator() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
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
    
    // פונקציה לשמירת נתוני התחזית
    function saveForecastData(forecastData) {
        const forecastId = Date.now().toString();
        
        try {
            // קבלת היסטוריית תחזיות שמורה
            let history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
            
            // הוספת התחזית החדשה
            history.push({
                id: forecastId,
                type: forecastData.forecastType,
                date: new Date().toISOString(),
                data: forecastData
            });
            
            // הגבלת ההיסטוריה ל-10 תחזיות אחרונות
            if (history.length > 10) {
                history = history.slice(-10);
            }
            
            // שמירת ההיסטוריה המעודכנת
            localStorage.setItem('forecastHistory', JSON.stringify(history));
            
            // שמירת התחזית הנוכחית
            localStorage.setItem(`forecast_${forecastId}`, JSON.stringify(forecastData));
            
            return forecastId;
        } catch (e) {
            console.error('שגיאה בשמירת נתוני התחזית:', e);
            showNotification('אירעה שגיאה בשמירת התחזית.', 'error');
            return forecastId;
        }
    }
    
    // פונקציה לניווט לדף התוצאות המתאים
    function navigateToResults(forecastId, type) {
        switch(type) {
            case 'personal':
                window.location.href = `personal-results.html?id=${forecastId}`;
                break;
            case 'professional':
                window.location.href = `professional-results.html?id=${forecastId}`;
                break;
            case 'couple':
                window.location.href = `couple-results.html?id=${forecastId}`;
                break;
            default:
                window.location.href = `results.html?id=${forecastId}&type=${type}`;
        }
    }
    
    // פונקציה להוספת סגנונות CSS נדרשים
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
                display: none;
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
    
    // טיפול בהגשת טפסים
    personalForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        showLoadingIndicator();
        
        const formData = new FormData(this);
        const userData = {
            name: formData.get('name'),
            dob: formData.get('dob'),
            gender: formData.get('gender'),
            forecastType: 'personal'
        };
        
        try {
            // קבלת תחזית נומרולוגית מהשירות
            const forecastData = await numerologyService.createNumerologyProfile(userData);
            
            // שמירת הנתונים ומעבר לדף התוצאות
            const forecastId = saveForecastData(forecastData);
            navigateToResults(forecastId, 'personal');
        } catch (error) {
            console.error('שגיאה בקבלת התחזית:', error);
            hideLoadingIndicator();
            showNotification('אירעה שגיאה בהכנת התחזית, אנא נסה שנית.', 'error');
        }
    });
    
    professionalForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        showLoadingIndicator();
        
        const formData = new FormData(this);
        const userData = {
            name: formData.get('name'),
            dob: formData.get('dob'),
            gender: formData.get('gender'),
            forecastType: 'professional'
        };
        
        try {
            // קבלת תחזית נומרולוגית מהשירות
            const forecastData = await numerologyService.createNumerologyProfile(userData);
            
            // שמירת הנתונים ומעבר לדף התוצאות
            const forecastId = saveForecastData(forecastData);
            navigateToResults(forecastId, 'professional');
        } catch (error) {
            console.error('שגיאה בקבלת התחזית:', error);
            hideLoadingIndicator();
            showNotification('אירעה שגיאה בהכנת התחזית, אנא נסה שנית.', 'error');
        }
    });
    
    coupleForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        showLoadingIndicator();
        
        const formData = new FormData(this);
        const userData1 = {
            name: formData.get('name1'),
            dob: formData.get('dob1'),
            gender: 'unknown', // אם לא מועבר במקור
            forecastType: 'couple'
        };
        
        const userData2 = {
            name: formData.get('name2'),
            dob: formData.get('dob2'),
            gender: 'unknown', // אם לא מועבר במקור
            forecastType: 'couple'
        };
        
        try {
            // קבלת תחזיות נומרולוגיות לשני בני הזוג
            const forecastData1 = await numerologyService.createNumerologyProfile(userData1);
            const forecastData2 = await numerologyService.createNumerologyProfile(userData2);
            
            // יצירת תחזית זוגית משולבת
            const coupleProfile = await createCoupleProfile(forecastData1, forecastData2, userData1, userData2);
            
            // שמירת הנתונים ומעבר לדף התוצאות
            const forecastId = saveForecastData(coupleProfile);
            navigateToResults(forecastId, 'couple');
        } catch (error) {
            console.error('שגיאה בקבלת התחזית הזוגית:', error);
            hideLoadingIndicator();
            showNotification('אירעה שגיאה בהכנת התחזית הזוגית, אנא נסה שנית.', 'error');
        } finally {
            hideLoadingIndicator();
        }
    });
    
    // פונקציות עזר לחישובים זוגיים
    
    // חישוב מספר תאימות זוגית
    function calculateCompatibilityNumber(number1, number2) {
        // חיבור שני המספרים ורדוקציה למספר בודד
        const sum = parseInt(number1) + parseInt(number2);
        return reduceToSingleDigit(sum);
    }
    
    // רדוקציה למספר בודד
    function reduceToSingleDigit(number) {
        if (number < 10) return number;
        
        // חיבור כל הספרות
        return reduceToSingleDigit(
            number.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
        );
    }
    
    // שילוב תכונות של שני בני הזוג
    function combineCoupleTraits(traits1, traits2) {
        // יצירת סט ייחודי של תכונות
        const uniqueTraits = new Set([...traits1, ...traits2]);
        
        // המרה חזרה למערך ומגבלה ל-10 תכונות
        return [...uniqueTraits].slice(0, 10);
    }
    
    // תכונות זוגיות ברירת מחדל
    function getDefaultCoupleStrengths() {
        return [
            'תקשורת פתוחה ואמינה',
            'יכולת לחלוק ערכים ומטרות משותפות',
            'איזון אנרגטי בין בני הזוג',
            'תמיכה הדדית בזמני אתגר',
            'יכולת לצמוח יחד דרך חוויות משותפות'
        ];
    }
    
    function getDefaultCoupleChallenges() {
        return [
            'דפוסי תקשורת שונים שיכולים ליצור אי הבנות',
            'מאבקי כוח אפשריים בקבלת החלטות',
            'תחומי עניין שמצריכים גישור',
            'אנרגיות מנוגדות שדורשות איזון',
            'צורך בכבוד וקבלה של צרכים שונים'
        ];
    }
    
    function getDefaultCoupleRecommendations() {
        return [
            'הקדישו זמן קבוע לשיחות עמוקות על מטרות משותפות',
            'פתחו מרחב לביטוי צרכים אישיים ללא שיפוטיות',
            'תרגלו פעילויות שיחזקו את החיבור הרגשי ביניכם',
            'שקלו לקחת זמן לחוויות חדשות שתחוו יחד השנה',
            'כבדו את ההבדלים ביניכם וראו אותם כהזדמנות לצמיחה'
        ];
    }
    
    // פונקציה ליצירת תחזית זוגית משולבת
    async function createCoupleProfile(profile1, profile2, userData1, userData2) {
        try {
            // יצירת פרומפט לבקשת ניתוח זוגי מ-GPT
            const prompt = `
אנא נתח את התאימות הזוגית בין שני הפרופילים הנומרולוגיים הבאים:

פרופיל 1:
- שם: ${userData1.name}
- תאריך לידה: ${userData1.dob}
- מספר גורל: ${profile1.destinyNumber}
- מספר שם: ${profile1.expressionNumber}
- מספר נפש: ${profile1.soulNumber}
- מספר מסלול חיים: ${profile1.lifePathNumber}

פרופיל 2:
- שם: ${userData2.name}
- תאריך לידה: ${userData2.dob}
- מספר גורל: ${profile2.destinyNumber}
- מספר שם: ${profile2.expressionNumber}
- מספר נפש: ${profile2.soulNumber}
- מספר מסלול חיים: ${profile2.lifePathNumber}

אנא ספק ניתוח זוגי שכולל:
1. מספר התאימות הזוגית (בין 1 ל-9)
2. הסבר על משמעות מספר התאימות
3. החוזקות של הזוג
4. האתגרים של הזוג
5. המלצות לשיפור התקשורת וההרמוניה בקשר
6. תחזית זוגית לשנה הקרובה

אנא ספק את התוצאות בפורמט JSON הבא:
{
  "coupleCompatibilityNumber": מספר,
  "compatibilityExplanation": "הסבר מפורט למספר התאימות",
  "strengths": ["חוזקה 1", "חוזקה 2", "חוזקה 3", ...],
  "challenges": ["אתגר 1", "אתגר 2", "אתגר 3", ...],
  "recommendations": ["המלצה 1", "המלצה 2", "המלצה 3", ...],
  "forecast": "תחזית לשנה הקרובה"
}`;

            // שליחת הבקשה ל-GPT
            const response = await fetch(numerologyService.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${numerologyService.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "אתה מומחה לנומרולוגיה זוגית עם התמחות בניתוח תאימות זוגית על פי מספרים נומרולוגיים."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1500
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            // פענוח התשובה
            const coupleAnalysis = numerologyService.parseGPTResponse(data.choices[0].message.content);
            
            // יצירת פרופיל זוגי מלא
            return {
                forecastType: 'couple',
                person1: {
                    name: userData1.name,
                    dob: userData1.dob,
                    ...profile1
                },
                person2: {
                    name: userData2.name,
                    dob: userData2.dob,
                    ...profile2
                },
                destinyNumber: coupleAnalysis.coupleCompatibilityNumber || calculateCompatibilityNumber(profile1.destinyNumber, profile2.destinyNumber),
                destinyExplanation: coupleAnalysis.compatibilityExplanation || "ניתוח התאימות הזוגית מבוסס על מספרי הגורל של שני בני הזוג ומשקף את הפוטנציאל, ההרמוניה והאתגרים ביחסים.",
                strengths: coupleAnalysis.strengths || getDefaultCoupleStrengths(),
                challenges: coupleAnalysis.challenges || getDefaultCoupleChallenges(),
                recommendations: coupleAnalysis.recommendations || getDefaultCoupleRecommendations(),
                traits: combineCoupleTraits(profile1.traits, profile2.traits)
            };
        } catch (error) {
            console.error('שגיאה ביצירת פרופיל זוגי:', error);
            // במקרה של שגיאה, החזרת פרופיל זוגי בסיסי
            return {
                forecastType: 'couple',
                person1: {
                    name: userData1.name,
                    dob: userData1.dob,
                    ...profile1
                },
                person2: {
                    name: userData2.name,
                    dob: userData2.dob,
                    ...profile2
                },
                destinyNumber: calculateCompatibilityNumber(profile1.destinyNumber, profile2.destinyNumber),
                destinyExplanation: "ניתוח התאימות הזוגית מבוסס על מספרי הגורל של שני בני הזוג ומשקף את הפוטנציאל, ההרמוניה והאתגרים ביחסים.",
                strengths: getDefaultCoupleStrengths(),
                challenges: getDefaultCoupleChallenges(),
                recommendations: getDefaultCoupleRecommendations(),
                traits: combineCoupleTraits(profile1.traits, profile2.traits)
            };
        }
    }
