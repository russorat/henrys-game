import { STORAGE_KEYS } from '../config.js';

export class ScoreManager {
  constructor() {
    this.score = 0;
  }

  reset() {
    this.score = 0;
  }

  add(points) {
    this.score += points;
    return this.score;
  }

  get() {
    return this.score;
  }
}

export class HighScoreManager {
  get() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.highScore) || '0', 10);
  }

  checkAndUpdate(score) {
    const current = this.get();
    if (score > current) {
      localStorage.setItem(STORAGE_KEYS.highScore, String(score));
      return true;
    }
    return false;
  }
}
