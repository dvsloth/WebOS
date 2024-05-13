document.addEventListener("DOMContentLoaded", function () {
    const desktop = document.getElementById('desktop');
    let selectionBox = null;
    let startX = 0, startY = 0;

    desktop.addEventListener('mousedown', function(e) {
        if (!isTitleBarClicked(e) && !isWindowClicked(e) && !e.shiftKey) {
            deselectAll();
        }
        if (selectionBox) {
            desktop.removeChild(selectionBox);
            selectionBox = null;
        }
        if (!isTitleBarClicked(e) && !isWindowClicked(e)) {
            startX = e.clientX;
            startY = e.clientY;
            selectionBox = document.createElement('div');
            selectionBox.className = 'selection-box';
            if (desktop.classList.contains('use-classic')) {
                selectionBox.classList.add('classic');
            }
            desktop.appendChild(selectionBox);
            selectionBox.style.left = `${startX}px`;
            selectionBox.style.top = `${startY}px`;
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
            selectionBox.style.display = 'block';
        }
        e.preventDefault();
    });

    let isMouseDown = false;

    desktop.addEventListener('mousedown', function() {
        isMouseDown = true;
    });

    document.addEventListener('mousemove', function (e) {
        if (!isTitleBarClicked(e) && !isWindowClicked(e) && isMouseDown && selectionBox) {
            const x = Math.min(e.clientX, startX);
            const y = Math.min(e.clientY, startY);
            const width = Math.abs(e.clientX - startX);
            const height = Math.abs(e.clientY - startY);
            selectionBox.style.left = `${x}px`;
            selectionBox.style.top = `${y}px`;
            selectionBox.style.width = `${width}px`;
            selectionBox.style.height = `${height}px`;
            selectIcons(x, y, width, height);
        }
    });

    document.addEventListener('mouseup', function () {
        isMouseDown = false; 
        if (selectionBox) {
            desktop.removeChild(selectionBox);
            selectionBox = null;
        }
    });

    function selectIcons(x, y, width, height) {
        const icons = document.querySelectorAll('.icon');
        icons.forEach(icon => {
            const iconRect = icon.getBoundingClientRect();
            if (iconRect.left + iconRect.width > x && iconRect.left < x + width &&
                iconRect.top + iconRect.height > y && iconRect.top < y + height) {
                icon.classList.add('selected');
            } else if (!icon.classList.contains('dragging')) {
                icon.classList.remove('selected');
            }
        });
    }

    function deselectAll() {
        const selectedIcons = document.querySelectorAll('.icon.selected');
        selectedIcons.forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    function isTitleBarClicked(e) {
        return e.target.classList.contains('title-bar') || e.target.closest('.title-bar');
    }

    function isWindowClicked(e) {
        return e.target.classList.contains('windows98-window') || e.target.closest('.windows98-window');
    }
});
