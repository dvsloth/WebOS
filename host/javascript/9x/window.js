document.addEventListener("DOMContentLoaded", function() {
    const icons = document.querySelectorAll('.icon');
    let windowIDs = {};

    icons.forEach(icon => {
        icon.addEventListener('dblclick', function() {
            openWindow(icon.dataset.windowContent, icon.querySelector('span').innerText);
        });
    });

    let zIndexCounter = 1;

    function openWindow(contentHTML, title) {
        const id = generateWindowID(title);
    
        const newWindow = document.createElement('div');
        newWindow.classList.add('window');
        newWindow.dataset.windowId = id;
        newWindow.style.zIndex = zIndexCounter++;
    
        const titleBar = document.createElement('div');
        titleBar.classList.add('title-bar');
        titleBar.addEventListener('mousedown', startDrag);
    
        const titleText = document.createElement('div');
        titleText.classList.add('title-text');
        titleText.innerText = title;
        titleBar.appendChild(titleText);
    
        const controlButtons = document.createElement('div');
        controlButtons.classList.add('control-buttons');
    
        const minimizeButton = createControlButton('-', 'minimize-button');
        const maximizeButton = createControlButton('[]', 'maximize-button', maximizeWindow);
        const closeButton = createControlButton('X', 'close-button', closeWindow);
    
        controlButtons.appendChild(minimizeButton);
        controlButtons.appendChild(maximizeButton);
        controlButtons.appendChild(closeButton);
    
        titleBar.appendChild(controlButtons);
    
        newWindow.appendChild(titleBar);
    
        const contentFrame = document.createElement('iframe');
        contentFrame.src = "./html/9x/" + contentHTML;
        newWindow.appendChild(contentFrame);
    
        document.getElementById('desktop').appendChild(newWindow);
    
        const taskbar = document.getElementById('taskbar');
        const taskbarIcon = document.createElement('div');
        taskbarIcon.classList.add('taskbar-icon');
        taskbarIcon.dataset.windowId = id;
        taskbarIcon.innerHTML = `<img src="./icons/${title.toLowerCase().replace(' ', '_')}.png" alt="${title} Icon"><span>${title}</span>`;
        taskbarIcon.addEventListener('click', function() {
            setWindowActive(id);
        });
        taskbar.insertBefore(taskbarIcon, taskbar.querySelector('#clock'));
    }

    function generateWindowID(title) {
        if (!windowIDs.hasOwnProperty(title)) {
            windowIDs[title] = 1;
        } else {
            windowIDs[title]++;
        }
        return `${title.toLowerCase().replace(' ', '_')}_${windowIDs[title]}`;
    }

    function createControlButton(text, className, clickHandler) {
        const button = document.createElement('button');
        button.classList.add(className);
        button.innerText = text;

        button.addEventListener('mousedown', function() {
            button.classList.add('pressed');
        });

        button.addEventListener('mouseup', function() {
            button.classList.remove('pressed');
            clickHandler();
        });

        return button;
    }

    let isDragging = false;
    let offsetX, offsetY, currentWindow;
    let originalPosition;

    function startDrag(e) {
        isDragging = true;
        currentWindow = e.target.closest('.window');
        if (currentWindow) {
            offsetX = e.clientX - currentWindow.getBoundingClientRect().left;
            offsetY = e.clientY - currentWindow.getBoundingClientRect().top;
            window.addEventListener('mousemove', drag);
            window.addEventListener('mouseup', stopDrag);
            currentWindow.style.zIndex = zIndexCounter++;
            setActiveTaskbarIcon(currentWindow.dataset.windowId);
            setInactiveWindows(currentWindow.dataset.windowId);
        }
    }
    function drag(e) {
        if (isDragging && currentWindow) {
            document.querySelectorAll("iframe").forEach(ele => ele.classList.add("fix-drag"));
            const desktopRect = document.getElementById('desktop').getBoundingClientRect();
            const maxX = desktopRect.width - currentWindow.offsetWidth;
            const maxY = desktopRect.height - currentWindow.offsetHeight;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.min(Math.max(x, 0), maxX);
            y = Math.min(Math.max(y, 0), maxY);
            currentWindow.style.left = x + 'px';
            currentWindow.style.top = y + 'px';
        }
    }

    function stopDrag() {
        isDragging = false;
        if (currentWindow) {
            const title = currentWindow.querySelector('.title-text').innerText;
            const position = { x: parseInt(currentWindow.style.left), y: parseInt(currentWindow.style.top) };
            localStorage.setItem(title, JSON.stringify(position));
            currentWindow = null;
        }
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', stopDrag);
    }

    function maximizeWindow() {
        if (currentWindow.classList.contains('maximized')) {
            currentWindow.classList.remove('maximized');
            currentWindow.style.width = '';
            currentWindow.style.height = '';
            currentWindow.style.left = originalPosition.x + 'px';
            currentWindow.style.top = originalPosition.y + 'px';
        } else {
            currentWindow.classList.add('maximized');
            originalPosition = {
                x: parseInt(currentWindow.style.left),
                y: parseInt(currentWindow.style.top)
            };
            currentWindow.style.width = '100%';
            currentWindow.style.height = '100%';
            currentWindow.style.left = '0';
            currentWindow.style.top = '0';
        }
    }

    function closeWindow() {
        currentWindow.remove();
        const taskbarIcons = document.querySelectorAll('.taskbar-icon');
        taskbarIcons.forEach(icon => {
            if (icon.dataset.windowId === currentWindow.dataset.windowId) {
                icon.remove();
            }
        });
    }

    function setActiveTaskbarIcon(windowId) {
        const taskbarIcons = document.querySelectorAll('.taskbar-icon');
        taskbarIcons.forEach(icon => {
            if (icon.dataset.windowId === windowId) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    }
    function setInactiveWindows(activeWindowId) {
        const windows = document.querySelectorAll('.window');
        windows.forEach(window => {
            if (window.dataset.windowId !== activeWindowId) {
                window.classList.add('inactive');
            } else {
                window.classList.remove('inactive');
            }
        });
    }

    function setWindowActive(windowId) {
        setActiveTaskbarIcon(windowId);
        setInactiveWindows(windowId);
        const clickedWindow = document.querySelector(`.window[data-window-id="${windowId}"]`);
        const windows = document.querySelectorAll('.window');
        let highestZIndex = 0;
        windows.forEach(window => {
            const zIndex = parseInt(window.style.zIndex);
            if (!isNaN(zIndex) && zIndex > highestZIndex) {
                highestZIndex = zIndex;
            }
        });
        clickedWindow.style.zIndex = highestZIndex + 1;
    }
});
