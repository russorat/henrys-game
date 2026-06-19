import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

export default class TouchControls {
  constructor(scene, onChange) {
    this.scene = scene;
    this.onChange = onChange;
    this.state = { left: false, right: false, jump: false, freeze: false };

    const btnSize = 64;
    const margin = 16;
    const bottom = GAME_HEIGHT - margin - btnSize / 2;

    this.createButton('btn-left', margin + btnSize / 2, bottom, '◀', 'left');
    this.createButton('btn-right', margin + btnSize * 1.5 + 8, bottom, '▶', 'right');
    this.createButton('btn-jump', GAME_WIDTH - margin - btnSize * 1.5 - 8, bottom, 'JUMP', 'jump');
    this.createButton('btn-freeze', GAME_WIDTH - margin - btnSize / 2, bottom, '❄', 'freeze');
  }

  createButton(texture, x, y, label, key) {
    const btn = this.scene.add.image(x, y, texture).setDepth(100).setInteractive();
    btn.setDisplaySize(64, 64);

    const text = this.scene.add.text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: key === 'jump' ? '14px' : '22px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(101);

    const press = () => {
      this.state[key] = true;
      this.onChange({ ...this.state });
    };
    const release = () => {
      this.state[key] = false;
      this.onChange({ ...this.state });
    };

    btn.on('pointerdown', press);
    btn.on('pointerup', release);
    btn.on('pointerout', release);
    text.setInteractive();
    text.on('pointerdown', press);
    text.on('pointerup', release);
    text.on('pointerout', release);
  }

  destroy() {
    // Buttons are destroyed with scene
  }
}
