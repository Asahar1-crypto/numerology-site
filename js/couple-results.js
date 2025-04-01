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
            if (person
