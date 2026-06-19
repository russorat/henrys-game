import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#87ceeb',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },
  input: {
    keyboard: true,
  },
  callbacks: {
    postBoot: (game) => {
      const canvas = game.canvas;
      if (canvas) {
        canvas.setAttribute('tabindex', '1');
        canvas.style.outline = 'none';
      }
    },
  },
  scene: [BootScene, MenuScene, GameScene, LevelCompleteScene, GameOverScene, VictoryScene],
};

new Phaser.Game(config);
