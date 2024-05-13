document.addEventListener("DOMContentLoaded", function () {
    const icons = document.querySelectorAll('.icon');
    let activeIcon = null;
    let offsetX = 0, offsetY = 0;
    let draggingMultiple = false;

    icons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            closeStartMenu();
            event.stopPropagation();
        });

        icon.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;

            offsetX = e.clientX - icon.getBoundingClientRect().left;
            offsetY = e.clientY - icon.getBoundingClientRect().top;

            if (!icon.classList.contains('selected')) {
                if (!e.shiftKey) {
                    deselectAll();
                }
                icon.classList.add('selected');
            }

            const selectedIcons = document.querySelectorAll('.icon.selected');
            draggingMultiple = selectedIcons.length > 1;

            if (draggingMultiple) {
                selectedIcons.forEach(selIcon => {
                    selIcon.dataset.startX = selIcon.offsetLeft - e.clientX;
                    selIcon.dataset.startY = selIcon.offsetTop - e.clientY;
                });
            } else {
                activeIcon = icon;
            }

            icon.classList.add('dragging');
            e.stopPropagation();
        });

        icon.addEventListener('dragstart', function (e) {
            e.preventDefault();
        });
    });

    document.addEventListener('mousemove', function (e) {
        moveIcons(e);
    });

    function moveIcons(e) {
        const selectedIcons = document.querySelectorAll('.icon.selected');
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const taskbarHeight = 40;

        if (draggingMultiple) {
            selectedIcons.forEach(selIcon => {
                let newX = e.clientX + parseInt(selIcon.dataset.startX);
                let newY = e.clientY + parseInt(selIcon.dataset.startY);
                newX = Math.max(0, Math.min(newX, viewportWidth - selIcon.offsetWidth));
                newY = Math.max(0, Math.min(newY, viewportHeight - selIcon.offsetHeight - taskbarHeight));
                selIcon.style.left = newX + 'px';
                selIcon.style.top = newY + 'px';
            });
        } else if (activeIcon) {
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            newLeft = Math.max(0, Math.min(newLeft, viewportWidth - activeIcon.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, viewportHeight - activeIcon.offsetHeight - taskbarHeight));
            activeIcon.style.left = newLeft + 'px';
            activeIcon.style.top = newTop + 'px';
        }
    }

    function deselectAll() {
        const selectedIcons = document.querySelectorAll('.icon.selected');
        selectedIcons.forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    document.addEventListener('mouseup', function () {
        const selectedIcons = document.querySelectorAll('.icon.dragging');
        selectedIcons.forEach(icon => {
            icon.classList.remove('dragging');
        });
        draggingMultiple = false;
        activeIcon = null;
    });
});
