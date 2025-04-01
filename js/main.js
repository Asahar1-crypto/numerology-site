document.addEventListener('DOMContentLoaded', function() {
    // אלמנטים של טפסים
    const personalForm = document.getElementById('personal-form');
    const professionalForm = document.getElementById('professional-form');
    const coupleForm = document.getElementById('couple-form');
    
    // אלמנטים של קוביות
    const personalCube = document.getElementById('personal-forecast');
    const professionalCube = document.getElementById('professional-forecast');
    const coupleCube = document.getElementById('couple-forecast');
    
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
        personalCube.classList.remove('active', 'inactive');
        professionalCube.classList.remove('active', 'inactive');
        coupleCube.classList.remove('active', 'inactive');
        
        // הגדרת כל הקוביות כלא פעילות
        personalCube.classList.add('inactive');
        professionalCube.classList.add('inactive');
        coupleCube.classList.add('inactive');
        
        // הגדרת הקובייה הנבחרת כפעילה
        activeCube.classList.remove('inactive');
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
    
    // טיפול בהגשת טפסים
    personalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        data.forecastType = 'personal';
        navigateToResults(data);
    });
    
    professionalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        data.forecastType = 'professional';
        navigateToResults(data);
    });
    
    coupleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        data.forecastType = 'couple';
        navigateToResults(data);
    });
    
    // פונקציה לניווט לדף התוצאות
    function navigateToResults(data) {
        // יצירת מזהה ייחודי לתחזית
        const forecastId = Date.now().toString();
        
        // שמירת נתוני התחזית בלוקל סטורג'
        saveForecastData(forecastId, data);
        
        // ניווט לדף התאים
        switch(data.forecastType) {
            case 'personal':
                window.location.href = `personal-results.html?id=${forecastId}`;
                break;
            case 'professional':
                window.location.href = `professional-results.html?id=${forecastId}`;
                break;
            case 'couple':
                window.location.href = `results.html?id=${forecastId}&type=couple`;
                break;
            default:
                window.location.href = `results.html?id=${forecastId}`;
        }
    }
    
    // פונקציה לשמירת נתוני התחזית
    function saveForecastData(id, data) {
        try {
            let history = JSON.parse(localStorage.getItem('forecastHistory') || '[]');
            
            // הוספת התחזית החדשה
            history.push({
                id: id,
                type: data.forecastType,
                date: new Date().toISOString(),
                data: data
            });
            
            // שמירת היסטוריה
            localStorage.setItem('forecastHistory', JSON.stringify(history));
        } catch (e) {
            console.error('Error saving forecast data:', e);
        }
    }
    
    // הפעלת המצב הראשוני - הטופס האישי והקובייה האישית פעילים
    showForm(personalForm);
    setActiveCube(personalCube);
    
    // בדיקה אם יש סוג תחזית מוגדר בכתובת URL
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('type');
    
    if (typeFromUrl) {
        switch(typeFromUrl) {
            case 'personal':
                showForm(personalForm);
                setActiveCube(personalCube);
                break;
            case 'professional':
                showForm(professionalForm);
                setActiveCube(professionalCube);
                break;
            case 'couple':
                showForm(coupleForm);
                setActiveCube(coupleCube);
                break;
        }
    }
});
