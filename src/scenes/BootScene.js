import Phaser from 'phaser';
import { PALETTE } from '../config.js';
import {
  createHenryTexture,
  createAnimalTextures,
  createIceBallTexture,
  createPlatformTextures,
  createFinishFlagTexture,
  createParticleTexture,
  createUIButtonTexture,
} from '../utils/textures.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.audio('music-menu', 'assets/audio/music-menu.wav');
    this.load.audio('music-game', 'assets/audio/music-game.wav');
    this.load.audio('sfx-jump', 'assets/audio/sfx-jump.wav');
    this.load.audio('sfx-shoot', 'assets/audio/sfx-shoot.wav');
    this.load.audio('sfx-freeze', 'assets/audio/sfx-freeze.wav');
    this.load.audio('sfx-explode', 'assets/audio/sfx-explode.wav');
    this.load.audio('sfx-die', 'assets/audio/sfx-die.wav');
    this.load.audio('sfx-level', 'assets/audio/sfx-level.wav');
    this.load.audio('sfx-score', 'assets/audio/sfx-score.wav');
  }

  create() {
    createHenryTexture(this);
    createAnimalTextures(this);
    createIceBallTexture(this);
    createPlatformTextures(this);
    createFinishFlagTexture(this);
    createParticleTexture(this);
    createUIButtonTexture(this, 'btn-left', PALETTE.uiBg);
    createUIButtonTexture(this, 'btn-right', PALETTE.uiBg);
    createUIButtonTexture(this, 'btn-jump', PALETTE.grass);
    createUIButtonTexture(this, 'btn-freeze', PALETTE.iceDark);

    this.scene.start('MenuScene');
  }
}
