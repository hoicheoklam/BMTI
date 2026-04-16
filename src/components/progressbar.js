// src/components/ProgressBar.js
export class ProgressBar {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }

    update(current, total) {
        if (this.element) {
            this.element.innerText = `${current} / ${total}`;
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }
}