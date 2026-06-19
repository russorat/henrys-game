import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PALETTE } from '../config.js';
import { HighScoreManager } from '../systems/ScoreManager.js';
import AudioManager from '../systems/AudioManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.highScoreManager = new HighScoreManager();
  }

  create() {
    new AudioManager(this);
    const audio = AudioManager.get();
    if (!audio.isMuted()) {
      audio.playMusic('music-menu', 0.4);
    }

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PALETTE.sky);

    // Clouds
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(50, GAME_WIDTH - 50),
        Phaser.Math.Between(40, 120),
        Phaser.Math.Between(60, 100),
        Phaser.Math.Between(30, 50),
        PALETTE.white,
        0.8
      );
      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
      });
    }

    this.add.text(GAME_WIDTH / 2, 80, "HENRY'S", {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#212121',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 120, 'ICE ADVENTURE', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#b3e5fc',
      stroke: '#1565c0',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const highScore = this.highScoreManager.get();
    this.add.text(GAME_WIDTH / 2, 175, `HIGH SCORE: ${highScore}`, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffd54f',
    }).setOrigin(0.5);

    const playBtn = this.add.text(GAME_WIDTH / 2, 260, '  PLAY  ', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playBtn.on('pointerdown', () => {
      audio.stopMusic();
      this.scene.start('GameScene', { levelIndex: 0, score: 0, newGame: true });
    });

    const muteLabel = audio.isMuted() ? '🔇 UNMUTE' : '🔊 MUTE';
    const muteBtn = this.add.text(GAME_WIDTH / 2, 330, muteLabel, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#b0bec5',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    muteBtn.on('pointerdown', () => {
      const muted = audio.toggleMute();
      muteBtn.setText(muted ? '🔇 UNMUTE' : '🔊 MUTE');
      if (!muted) audio.playMusic('music-menu', 0.4);
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, 'Freeze animals, then run into them!', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#455a64',
    }).setOrigin(0.5);
  }
}
