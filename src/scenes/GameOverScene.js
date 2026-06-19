import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PALETTE } from '../config.js';
import { HighScoreManager } from '../systems/ScoreManager.js';
import AudioManager from '../systems/AudioManager.js';
import { bindMenuKeys, pollMenuKeys } from '../utils/menuKeyboard.js';
import { focusGameCanvas, setupKeyboardCapture } from '../utils/keyboardSetup.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.levelIndex = data.levelIndex;
    this.score = data.score;
  }

  create() {
    this.transitioning = false;

    new AudioManager(this);
    const highScoreManager = new HighScoreManager();

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PALETTE.skyDark, 0.85);

    this.add.text(GAME_WIDTH / 2, 110, 'Oops!', {
      fontFamily: 'monospace',
      fontSize: '40px',
      color: '#ef5350',
      stroke: '#b71c1c',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 175, 'Try Again!', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 220, `Score: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffd54f',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 255, `Best: ${highScoreManager.get()}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#b0bec5',
    }).setOrigin(0.5);

    const retryBtn = this.add.text(GAME_WIDTH / 2, 310, '  TRY AGAIN  ', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#42a5f5',
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retryBtn.on('pointerdown', () => this.retry());

    const quitBtn = this.add.text(GAME_WIDTH / 2, 370, '  QUIT  ', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#b0bec5',
      backgroundColor: '#37474f',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    quitBtn.on('pointerdown', () => this.quit());

    bindMenuKeys(this, {
      confirm: () => this.retry(),
      cancel: () => this.quit(),
    });
    setupKeyboardCapture(this);
    focusGameCanvas(this);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 24, 'Enter = try again   Esc = quit', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#78909c',
    }).setOrigin(0.5);
  }

  retry() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.scene.start('GameScene', {
      levelIndex: this.levelIndex,
      score: this.score,
    });
  }

  quit() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.scene.start('MenuScene');
  }

  update() {
    pollMenuKeys(this);
  }

  shutdown() {
    this.transitioning = false;
  }
}
