// קוד ספציפי לדף תחזית זוגית
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const forecastId = urlParams.get('id');
    
    if (!forecastId) return;
    
    // יסודות DOM לפרטי בני הזוג
    const person1Name = document.getElementById('person1-name');
    const person1Birthdate = document.getElementById('person1-birthdate');
    const person1Destiny = document.getElementById('person1-destiny');
    const person1Expression = document.getElementById('person1-expression');
    const person1Personality = document.getElementById('person1-personality');
    const person1Soul = document.getElementById('person1-soul');
    
    const person2Name = document.getElementById('person2-name');
    const person2Birthdate = document.getElementById('person2-birthdate');
    const person2Destiny = document.getElementById('person2-destiny');
    const person2Expression = document.getElementById('person2-expression');
    const person2Personality = document.getElementById('person2-personality');
    const person2Soul = document.getElementById('person2-soul');
    
    // הוספת מאזין אירועים לטעינת תחזית
    window.addEventListener('forecast-loaded', function(e) {
        const forecastData = e.detail;
        
        if (forecastData && forecastData.forecastType === 'couple') {
            updateCoupleUI(forecastData);
        }
    });
    
    // פונקציה לעדכון ממשק המשתמש לתחזית זוגית
    function updateCoupleUI(data) {
        // עדכון פרטי בן/בת הזוג הראשון/ה
        if (data.person1) {
            if (person1Name) person1Name.textContent = data.person1.name || '';
            if (person1Birthdate) person1Birthdate.textContent = formatDate(new Date(data.person1.dob)) || '';
            if (person1Destiny) person1Destiny.textContent = data.person1.destinyNumber || '';
            if (person1Expression) person1Expression.textContent = data.person1.expressionNumber || '';
            if (person1Personality) person1Personality.textContent = data.person1.personalityNumber || '';
            if (person1Soul) person1Soul.textContent = data.person1.soulNumber || '';
        }
        
        // עדכון פרטי בן/בת הזוג השני/ה
        if (data.person2) {
            if (person2Name) person2Name.textContent = data.person2.name || '';
            if (person2Birthdate) person2Birthdate.textContent = formatDate(new Date(data.person2.dob)) || '';
            if (person2Destiny) person2Destiny.textContent = data.person2.destinyNumber || '';
            if (person2Expression) person2Expression.textContent = data.person2.expressionNumber || '';
            if (person2Personality) person2Personality.textContent = data.person2.personalityNumber || '';
            if (person2Soul) person2Soul.textContent = data.person2.soulNumber || '';
        }
        
        // אנימציה מיוחדת לפרופיל הזוגי
        animateCoupleProfiles();
    }
    
    // פונקציה לאנימציה של פרופילי בני הזוג
    function animateCoupleProfiles() {
        const person1Profile = document.getElementById('person1-profile');
        const person2Profile = document.getElementById('person2-profile');
        const connector = document.querySelector('.couple-connector');
        
        if (person1Profile) {
            person1Profile.style.opacity = '0';
            person1Profile.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                person1Profile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                person1Profile.style.opacity = '1';
                person1Profile.style.transform = 'translateX(0)';
            }, 300);
        }
        
        if (connector) {
            connector.style.opacity = '0';
            
            setTimeout(() => {
                connector.style.transition = 'opacity 0.8s ease';
                connector.style.opacity = '1';
            }, 600);
        }
        
        if (person2Profile) {
            person2Profile.style.opacity = '0';
            person2Profile.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                person2Profile.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                person2Profile.style.opacity = '1';
                person2Profile.style.transform = 'translateX(0)';
            }, 900);
        }
    }
    
    // פונקציה לפורמט תאריך
    function formatDate(date) {
        if (!date || isNaN(date)) return '';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('he-IL', options).format(date);
    }
