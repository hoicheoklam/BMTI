// src/components/QuestionCard.js
export class QuestionCard {
    constructor(elements) {
        this.questionText = document.getElementById(elements.textId);
        this.imageSection = document.getElementById(elements.imageId);
        this.optionsWrapper = document.getElementById(elements.optionsId);
        this.cardBody = document.getElementById(elements.cardBodyId);
    }

    render(question, onAnswerSubmit) {
        // Render Text
        this.questionText.innerText = question.text;

        // Render Image
        if (question.image) {
            this.imageSection.innerHTML = `<img src="${question.image}" alt="題目配圖">`;
            this.imageSection.style.display = 'flex';
        } else {
            this.imageSection.innerHTML = '';
            this.imageSection.style.display = 'none';
        }

        // Render Options
        this.optionsWrapper.innerHTML = '';
        question.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-letter">${opt.letter}</span> ${opt.text}`;
            btn.onclick = () => onAnswerSubmit(opt);
            this.optionsWrapper.appendChild(btn);
        });
    }

    animateTransition(callback) {
        this.cardBody.classList.add('fade-out');
        setTimeout(() => {
            callback(); // Trigger the next question render mid-animation
            this.cardBody.classList.remove('fade-out');
            this.cardBody.classList.add('fade-in');
            setTimeout(() => {
                this.cardBody.classList.remove('fade-in');
            }, 300);
        }, 300);
    }

    hide() {
        this.questionText.style.display = 'none';
        this.optionsWrapper.style.display = 'none';
        if (this.imageSection) this.imageSection.style.display = 'none';
    }
}