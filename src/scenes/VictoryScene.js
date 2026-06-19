import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PALETTE } from '../config.js';
import { HighScoreManager } from '../systems/ScoreManager.js';
import AudioManager from '../systems/AudioManager.js';
import { launchFireworks } from '../ui/Fireworks.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.score = data.score;
    this.newHighScore = data.newHighScore;
  }

  create() {
    new AudioManager(this);
    const highScoreManager = new HighScoreManager();

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PALETTE.sky);

    this.add.text(GAME_WIDTH / 2, 90, 'YOU WIN!', {
      fontFamily: 'monospace',
      fontSize: '42px',
      color: '#ffd54f',
      stroke: '#f57f17',
      strokeThickness: 5,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 155, 'Henry saved the day!', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 210, `Final Score: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#b3e5fc',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 250, `High Score: ${highScoreManager.get()}`, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffd54f',
    }).setOrigin(0.5);

    if (this.newHighScore) {
      this.add.text(GAME_WIDTH / 2, 290, 'NEW HIGH SCORE!', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ff7043',
      }).setOrigin(0.5);
    }

    launchFireworks(this);
    AudioManager.get()?.play('sfx-level', { volume: 0.6 });

    const menuBtn = this.add.text(GAME_WIDTH / 2, 360, '  BACK TO MENU  ', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
