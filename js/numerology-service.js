// numerology-service.js
// שירות לחישובים נומרולוגיים וחיבור ל-GPT

class NumerologyService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        this.hebrewLetterValues = {
            'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
            'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
            'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400, 'ך': 20, 'ם': 40, 'ן': 50, 'ף': 80, 'ץ': 90
        };
    }

    // חישוב מספר הגורל מתאריך לידה
    calculateDestinyNumber(dateString) {
        // המרת תאריך למספר יום, חודש ושנה ושילוב שלהם
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // חיבור כל הספרות
        let sum = this.addDigits(day) + this.addDigits(month) + this.addDigits(year);
        
        // רדוקציה למספר בודד (אלא אם זה מספר מאסטר: 11, 22, 33)
        return this.reduceToSingleDigit(sum);
    }

    // חישוב מספר השם מהשם המלא
    calculateExpressionNumber(fullName) {
        let sum = 0;
        
        // מעבר על כל האותיות בשם וחיבור הערכים שלהן
        for (let i = 0; i < fullName.length; i++) {
            const letter = fullName[i];
            if (this.hebrewLetterValues[letter]) {
                sum += this.hebrewLetterValues[letter];
            }
        }
        
        // רדוקציה למספר בודד
        return this.reduceToSingleDigit(sum);
    }

    // חישוב מספר האישיות מהאותיות הראשונות בשם הפרטי
    calculatePersonalityNumber(firstName) {
        if (!firstName || firstName.length === 0) return 0;
        
        // קבלת האות הראשונה
        const firstLetter = firstName[0];
        
        // המרה למספר
        const value = this.hebrewLetterValues[firstLetter] || 0;
        
        // רדוקציה למספר בודד
        return this.reduceToSingleDigit(value);
    }

    // חישוב מספר הנפש מכל התנועות בשם
    calculateSoulNumber(fullName) {
        // הגדרת התנועות בעברית
        const vowels = ['א', 'ה', 'ו', 'י', 'ע'];
        let sum = 0;
        
        // מעבר על כל האותיות בשם וחיבור רק התנועות
        for (let i = 0; i < fullName.length; i++) {
            const letter = fullName[i];
            if (vowels.includes(letter) && this.hebrewLetterValues[letter]) {
                sum += this.hebrewLetterValues[letter];
            }
        }
        
        // רדוקציה למספר בודד
        return this.reduceToSingleDigit(sum);
    }

    // חישוב מספר מסלול החיים
    calculateLifePathNumber(dateString) {
        // זהה לחישוב מספר הגורל אבל לעתים מחושב בדרך שונה בנומרולוגיה
        // לצורך הדוגמה, נחשב אותו באותה צורה
        return this.calculateDestinyNumber(dateString);
    }

    // פונקציה עזר לחיבור כל הספרות במספר
    addDigits(number) {
        return number.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    // פונקציה עזר לרדוקציה למספר בודד (אלא אם זה מספר מאסטר)
    reduceToSingleDigit(number) {
        // בדיקה אם זה מספר מאסטר (11, 22, 33)
        if ((number === 11 || number === 22 || number === 33) || number < 10) {
            return number;
        }
        
        // המשך רדוקציה עד למספר בודד
        return this.reduceToSingleDigit(this.addDigits(number));
    }

    // יצירת פרופיל נומרולוגי מלא
    async createNumerologyProfile(userData) {
        // חישוב כל המספרים הנומרולוגיים
        const profile = {
            destinyNumber: this.calculateDestinyNumber(userData.dob),
            expressionNumber: this.calculateExpressionNumber(userData.name),
            personalityNumber: this.calculatePersonalityNumber(userData.name.split(' ')[0]),
            soulNumber: this.calculateSoulNumber(userData.name),
            lifePathNumber: this.calculateLifePathNumber(userData.dob)
        };

        // קבלת פירושים וחלקים נוספים באמצעות GPT
        try {
            const interpretations = await this.getInterpretationsFromGPT(profile, userData);
            return { ...profile, ...interpretations };
        } catch (error) {
            console.error('שגיאה בקבלת פירושים מ-GPT:', error);
            // במקרה של שגיאה, החזרת נתונים סטטיים כברירת מחדל
            return { 
                ...profile,
                ...this.getStaticInterpretations(profile)
            };
        }
    }

    // קבלת פירושים מ-GPT
    async getInterpretationsFromGPT(numerologyProfile, userData) {
        // הכנת ההודעה ל-GPT
        const prompt = this.createGPTPrompt(numerologyProfile, userData);
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "אתה מומחה לנומרולוגיה ישראלית עם ידע רב בחישובים נומרולוגיים ופירושם. עליך לספק פירוש מפורט ואישי למספרים נומרולוגיים."
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
            
            // פענוח התשובה וארגונה כאובייקט
            return this.parseGPTResponse(data.choices[0].message.content);
            
        } catch (error) {
            console.error('שגיאה בתקשורת עם GPT:', error);
            throw error;
        }
    }

    // יצירת פרומפט מובנה ל-GPT
    createGPTPrompt(numerologyProfile, userData) {
        return `
אנא נתח את הפרופיל הנומרולוגי הבא ותן פירוש מפורט לכל מספר.
פרטי המשתמש:
- שם מלא: ${userData.name}
- תאריך לידה: ${userData.dob}
- מגדר: ${userData.gender}
- סוג התחזית: ${userData.forecastType}

מספרים נומרולוגיים:
- מספר הגורל: ${numerologyProfile.destinyNumber}
- מספר השם (אקספרשן): ${numerologyProfile.expressionNumber}
- מספר האישיות: ${numerologyProfile.personalityNumber}
- מספר הנפש: ${numerologyProfile.soulNumber}
- מספר מסלול החיים: ${numerologyProfile.lifePathNumber}

אנא ספק את התוצאות בפורמט JSON הבא:
{
  "destinyExplanation": "פירוש מפורט למספר הגורל",
  "traits": ["תכונה 1", "תכונה 2", "תכונה 3", ...],
  "strengths": ["חוזקה 1", "חוזקה 2", "חוזקה 3", ...],
  "challenges": ["אתגר 1", "אתגר 2", "אתגר 3", ...],
  "recommendations": ["המלצה 1", "המלצה 2", "המלצה 3", ...]
}

אנא התאם את התכנים לסוג התחזית: אישית, מקצועית או זוגית. יש להתייחס לנקודות החוזק והאתגרים בהתאם לסוג התחזית וכן לספק המלצות רלוונטיות לשנה הקרובה.`;
    }

    // פענוח התשובה מ-GPT
    parseGPTResponse(responseText) {
        try {
            // ניסיון למצוא את ה-JSON בתשובה
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // אם לא נמצא JSON תקין, החזרת ברירת מחדל
            throw new Error('לא נמצא פורמט JSON תקין בתשובה');
            
        } catch (error) {
            console.error('שגיאה בפענוח תשובת GPT:', error);
            return this.getStaticInterpretations({ destinyNumber: 7 }); // ברירת מחדל
        }
    }

    // קבלת פירושים סטטיים כברירת מחדל במקרה של שגיאה
    getStaticInterpretations(profile) {
        const destinyExplanations = {
            1: 'אתה מיועד להיות מנהיג ולהוביל אחרים. עם יכולת משופרת ליצור מציאות חדשה, עליך להתמקד בעצמאות, בטחון עצמי, ויזמות. אתה חלוץ טבעי ויש לך את הכוח להגשים כל רעיון שתבחר.',
            2: 'את מוצאת הרמוניה באינטראקציות אנושיות ושיתופי פעולה. עם רגישות גבוהה ואינטואיציה חדה, יש לך יכולת לאזן ולתווך. תפקידך הוא לחבר בין אנשים ולבנות שלום.',
            3: 'האנרגיה היצירתית שלך זורמת בחופשיות. כבעל/ת מספר גורל 3, יש לך כישרון בביטוי עצמי ויכולת להעביר רעיונות באופן מרתק. מטרתך היא לשתף את האמת שלך עם העולם דרך אמנות, כתיבה או דיבור.',
            4: 'הייעוד שלך קשור בבניית מסגרות יציבות וארוכות טווח. את/ה אדם אמין וקשה-עבודה המביא סדר לכאוס. המשימה שלך בחיים היא לבנות יסודות מוצקים לעצמך ולאחרים.',
            5: 'נולדת להיות חופשי ולחקור את העולם. כבעל/ת מספר גורל 5, את/ה מונע/ת על ידי סקרנות והרפתקנות. תפקידך הוא לחוות את החיים במלואם ולהתאים עצמך לשינויים בקלות.',
            6: 'יש לך תחושת אחריות מולדת וצורך לטפל באחרים. אתה מביא אהבה ללא תנאי ורצון לשרת. תפקידך הוא ליצור הרמוניה בבית ובקהילה ולהיות אור מנחה לאחרים.',
            7: 'אתה נשמה חוקרת במסע רוחני. כבעל מספר גורל 7, יש לך תודעה אנליטית ורצון לגלות את האמת. תפקידך הוא לחפש ידע, להגיע להארה רוחנית, ולשתף את חוכמתך עם אחרים.',
            8: 'נולדת להשיג עוצמה והצלחה חומרית. יש לך הבנה אינטואיטיבית של כוח ויכולת לממש חזון גדול. תפקידך הוא לשגשג כדי להשפיע לטובה ולהשתמש במשאביך כדי לעזור לאחרים.',
            9: 'אתה אדם הומניטרי עם אמפתיה גבוהה. כבעל מספר גורל 9, יש לך תשוקה לצדק חברתי ושיפור המצב האנושי. תפקידך הוא להשפיע על מספר גדול של אנשים ולהביא שינוי חיובי.'
        };

        // תכונות, חוזקות, אתגרים והמלצות כלליות
        return {
            destinyExplanation: destinyExplanations[profile.destinyNumber] || 'מספר הגורל שלך מכיל את המיסטיקה והחכמה היקומית שמלווה אותך בכל צעד בחייך. הוא מגלה את הפוטנציאל הגדול והאתגרים שעליך להתגבר עליהם בדרך להגשמת הייעוד שלך.',
            traits: ['אינטואיטיבי', 'יצירתי', 'רגיש', 'אחראי', 'שאפתן', 'מנהיג', 'אנליטי'],
            strengths: [
                'יכולת התבוננות עמוקה',
                'חשיבה מחוץ לקופסה',
                'קשר חזק לאינטואיציה',
                'יכולת הכלה רגשית גבוהה',
                'כישורי מנהיגות טבעיים'
            ],
            challenges: [
                'נטייה לביקורתיות יתר',
                'קושי להתפשר',
                'רגישות יתר למצבים חברתיים',
                'נטייה להתבודדות בזמני לחץ',
                'קושי לקבל ביקורת'
            ],
            recommendations: [
                'השנה מתאימה להתמקד בהתפתחות אישית ולמידה של מיומנויות חדשות.',
                'חודש אוקטובר יהיה מתאים במיוחד להתחלות חדשות בתחום המקצועי.',
                'הקדש זמן איכות ליקיריך במהלך החודשים הקרובים.',
                'תרגול מדיטציה או פעילות רוחנית תסייע לאזן את האנרגיות שלך.',
                'שים לב לאינטואיציה שלך בקבלת החלטות כלכליות בתקופה הקרובה.'
            ]
        };
    }
}

// ייצוא הקלאס
window.NumerologyService = NumerologyService;
