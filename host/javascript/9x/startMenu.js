document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('start-menu');

    startButton.addEventListener('click', function() {
        this.classList.toggle('pressed');
        startMenu.classList.toggle('hidden');
    });

    const taskbar = document.getElementById('taskbar');
    taskbar.addEventListener('click', function(event) {
        if (!event.target.classList.contains('start-button')) {
            closeStartMenu();
        }
    });

    function closeStartMenu() {
        if (!startMenu.classList.contains('hidden')) {
            startMenu.classList.add('hidden');
            startButton.classList.remove('pressed');
        }
    }
});
