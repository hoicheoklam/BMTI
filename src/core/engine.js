// src/core/engine.js
import { questions } from '../data/questions.js';
import { optionWeights } from './constants.js'; 
import { addWeightsToScore, getFinalScores } from './score.js';

export class QuizEngine {
    constructor() {
        this.currentIndex = 0;
        this.userAnswers = [];
    }

    getCurrentQuestion() {
        if (this.isFinished()) return null;
        return questions[this.currentIndex];
    }

    isFinished() {
        return this.currentIndex >= questions.length;
    }

    getProgress() {
        return {
            current: this.currentIndex + 1,
            total: questions.length
        };
    }

    submitAnswer(selectedOption) {
        this.userAnswers.push(selectedOption.letter);
        
        // 1. Calculate Score
        const weightsToApply = optionWeights[selectedOption.id];
        if (weightsToApply) {
            addWeightsToScore(weightsToApply);
        }

        // 2. Determine Next Question
        if (selectedOption.nextId) {
            const targetIndex = questions.findIndex(q => q.id === selectedOption.nextId);
            this.currentIndex = targetIndex !== -1 ? targetIndex : this.currentIndex + 1;
        } else {
            this.currentIndex++;
        }
    }

    getResults() {
        return getFinalScores();
    }
}