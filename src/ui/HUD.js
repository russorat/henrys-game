import Phaser from 'phaser';
import { GAME_WIDTH } from '../config.js';

export default class HUD {
  constructor(scene, scoreManager, highScoreManager) {
    this.scene = scene;
    this.scoreManager = scoreManager;
    this.highScoreManager = highScoreManager;

    this.scoreText = scene.add.text(GAME_WIDTH - 16, 12, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#212121',
      strokeThickness: 3,
    }).setOrigin(1, 0).setDepth(100).setScrollFactor(0);

    this.highScoreText = scene.add.text(16, 12, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffd54f',
      stroke: '#212121',
      strokeThickness: 2,
    }).setDepth(100).setScrollFactor(0);

    this.levelText = scene.add.text(GAME_WIDTH / 2, 12, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#b3e5fc',
      stroke: '#1565c0',
      strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(100).setScrollFactor(0);

    this.update();
  }

  setLevel(levelNum) {
    this.levelText.setText(`LEVEL ${levelNum}`);
  }

  update() {
    this.scoreText.setText(`SCORE: ${this.scoreManager.get()}`);
    this.highScoreText.setText(`BEST: ${this.highScoreManager.get()}`);
  }
}
