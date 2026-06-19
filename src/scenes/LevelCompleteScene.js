import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PALETTE } from '../config.js';
import { HighScoreManager } from '../systems/ScoreManager.js';
import AudioManager from '../systems/AudioManager.js';
import { launchFireworks } from '../ui/Fireworks.js';
import { bindMenuKeys, pollMenuKeys } from '../utils/menuKeyboard.js';
import { focusGameCanvas, setupKeyboardCapture } from '../utils/keyboardSetup.js';

export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelCompleteScene');
  }

  init(data) {
    this.levelIndex = data.levelIndex;
    this.score = data.score;
  }

  create() {
    new AudioManager(this);
    const highScoreManager = new HighScoreManager();
    const newHighScore = highScoreManager.checkAndUpdate(this.score);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PALETTE.skyDark, 0.9);

    this.add.text(GAME_WIDTH / 2, 100, 'LEVEL COMPLETE!', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#4caf50',
      stroke: '#1b5e20',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 160, `Level ${this.levelIndex + 1} Done!`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 210, `Score: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffd54f',
    }).setOrigin(0.5);

    if (newHighScore) {
      this.add.text(GAME_WIDTH / 2, 250, 'NEW HIGH SCORE!', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ff7043',
      }).setOrigin(0.5);
      launchFireworks(this);
      AudioManager.get()?.play('sfx-score', { volume: 0.5 });
    }

    const nextBtn = this.add.text(GAME_WIDTH / 2, 320, '  NEXT LEVEL  ', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    nextBtn.on('pointerdown', () => this.nextLevel());

    bindMenuKeys(this, { confirm: () => this.nextLevel() });
    setupKeyboardCapture(this);
    focusGameCanvas(this);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 24, 'Enter = next level', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#78909c',
    }).setOrigin(0.5);
  }

  nextLevel() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.scene.start('GameScene', {
      levelIndex: this.levelIndex + 1,
      score: this.score,
    });
  }

  update() {
    pollMenuKeys(this);
  }
}
