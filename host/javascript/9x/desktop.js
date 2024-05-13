document.addEventListener("DOMContentLoaded", function () {
    const desktop = document.getElementById('desktop');
    let isDragging = false;
    let dragThreshold = 5;

    window.addEventListener('resize', function () {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const taskbarHeight = 40;
        const icons = document.querySelectorAll('.icon');

        icons.forEach(icon => {
            const currentLeft = parseInt(icon.style.left, 10);
            const currentTop = parseInt(icon.style.top, 10);
            if (currentLeft + icon.offsetWidth > viewportWidth) {
                icon.style.left = (viewportWidth - icon.offsetWidth) + 'px';
            }
            if (currentTop + icon.offsetHeight > viewportHeight - taskbarHeight) {
                icon.style.top = (viewportHeight - taskbarHeight - icon.offsetHeight) + 'px';
            }
        });
    });

    desktop.addEventListener('click', function (event) {
        if (event.target === desktop) {
            closeStartMenu();
            setInactiveWindows();
            removeActiveTaskbarIcons();
        }
    });

    function closeStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.querySelector('.start-button');
        if (!startMenu.classList.contains('hidden')) {
            startMenu.classList.add('hidden');
            startButton.classList.remove('pressed');
        }
    }

    function setInactiveWindows() {
        const windows = document.querySelectorAll('.windows98-window');
        windows.forEach(window => {
            window.classList.add('inactive');
        });
    }

    function removeActiveTaskbarIcons() {
        const taskbarIcons = document.querySelectorAll('.taskbar-icon');
        taskbarIcons.forEach(icon => {
            icon.classList.remove('active');
        });
    }

    document.addEventListener('mousedown', function (event) {
        if (event.target.closest('.title-bar')) {
            let startX = event.clientX;
            let startY = event.clientY;

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);

            function mouseMoveHandler(event) {
                let moveX = event.clientX - startX;
                let moveY = event.clientY - startY;

                if (Math.abs(moveX) > dragThreshold || Math.abs(moveY) > dragThreshold) {
                    isDragging = true;
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                }
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                if (!isDragging) {
                    isDragging = false;
                }
            }
        }
    });
});
