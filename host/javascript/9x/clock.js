document.addEventListener("DOMContentLoaded", function () {
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes; 
        const timeString = hours + ':' + minutes;
        document.getElementById('clock').textContent = timeString;
    }

    updateClock();
    setInterval(updateClock, 60000);
});
