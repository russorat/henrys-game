import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

export function launchFireworks(scene) {
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffd54f];

  for (let i = 0; i < 8; i++) {
    scene.time.delayedCall(i * 300, () => {
      const x = Phaser.Math.Between(80, GAME_WIDTH - 80);
      const y = Phaser.Math.Between(60, GAME_HEIGHT - 120);
      const color = Phaser.Utils.Array.GetRandom(colors);

      const emitter = scene.add.particles(x, y, 'particle', {
        speed: { min: 80, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.5, end: 0 },
        lifespan: 800,
        quantity: 20,
        tint: color,
        gravityY: 100,
      });

      scene.time.delayedCall(1000, () => emitter.destroy());
    });
  }

  scene.cameras.main.flash(300, 255, 215, 79, false);
}

export function createExplosion(scene, x, y) {
  const emitter = scene.add.particles(x, y, 'particle', {
    speed: { min: 50, max: 150 },
    angle: { min: 0, max: 360 },
    scale: { start: 1, end: 0 },
    lifespan: 400,
    quantity: 12,
    tint: [0xb3e5fc, 0x4fc3f7, 0xffffff],
    gravityY: 200,
  });
  scene.time.delayedCall(500, () => emitter.destroy());
}
