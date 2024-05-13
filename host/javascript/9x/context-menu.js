document.addEventListener('DOMContentLoaded', function() {
    const desktop = document.getElementById('desktop');
    const refreshOption = document.getElementById('refresh');
    const contextMenu = document.getElementById('context-menu');
    const NewContext = document.getElementById('context-new');
    const RBANDContext = document.getElementById('context-RBAND');
    const classicDotted = document.getElementById('Classic-Dotted');
    const newGenBlue = document.getElementById('New-gen-blue');

    classicDotted.addEventListener('click', function() {
        desktop.classList.add('use-classic');
    });

    newGenBlue.addEventListener('click', function() {
        desktop.classList.remove('use-classic');
    });

    desktop.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        clearSelections();

        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.display = 'block';

        document.addEventListener('click', function closeMenu() {
            contextMenu.style.display = 'none';
            document.removeEventListener('click', closeMenu);
        });
        document.addEventListener('click', function closeMenu(e) {
            if (!contextMenu.contains(e.target) && !NewContext.contains(e.target) && !RBANDContext.contains(e.target)) {
                contextMenu.style.display = 'none';
                NewContext.style.display = 'none';
                RBANDContext.style.display = 'none';
                document.removeEventListener('click', closeMenu);
            }
        });
    });

    document.getElementById('New-Context').addEventListener('mouseenter', function(e) {
        const contextMenuRect = contextMenu.getBoundingClientRect();
        NewContext.style.top = `${contextMenuRect.top}px`;
        NewContext.style.left = `${contextMenuRect.right}px`;
        NewContext.style.display = 'block';
    });

    document.getElementById('New-Context').addEventListener('mouseleave', function(e) {
        if (!NewContext.matches(':hover')) {
            NewContext.style.display = 'none';
        }
    });

    NewContext.addEventListener('mouseleave', function(e) {
        if (!document.getElementById('New-Context').matches(':hover')) {
            NewContext.style.display = 'none';
        }
    });

    document.getElementById('RBAND').addEventListener('mouseenter', function(e) {
        const contextMenuRect = contextMenu.getBoundingClientRect();
        RBANDContext.style.top = `${contextMenuRect.top}px`;
        RBANDContext.style.left = `${contextMenuRect.right}px`;
        RBANDContext.style.display = 'block';
    });

    document.getElementById('RBAND').addEventListener('mouseleave', function(e) {
        if (!RBANDContext.matches(':hover')) {
            RBANDContext.style.display = 'none';
        }
    });

    RBANDContext.addEventListener('mouseleave', function(e) {
        if (!document.getElementById('RBAND').matches(':hover')) {
            RBANDContext.style.display = 'none';
        }
    });

    [NewContext, RBANDContext].forEach(menu => {
        menu.addEventListener('click', function(e) {
            if (e.target.tagName === 'LI') {
                contextMenu.style.display = 'none';
                menu.style.display = 'none';
            }
        });
    });

    function clearSelections() {
        const selectionBoxes = desktop.querySelectorAll('.selection-box');
        selectionBoxes.forEach(box => {
            box.parentElement.removeChild(box);
        });

        const selectedIcons = desktop.querySelectorAll('.icon.selected');
        selectedIcons.forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    refreshOption.addEventListener('click', function() {
        clearSelections();

        desktop.style.transition = 'opacity 0.01s ease-in-out';
        desktop.style.opacity = '0';

        setTimeout(function() {
            desktop.style.opacity = '1';
        }, 500);
    });
});
