import Phaser from 'phaser';
import { SPRITE_SCALE } from '../config.js';

const ICE_SPEED = 350;

export { ICE_SPEED };

export default class IceBall extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction) {
    super(scene, x, y, 'ice-ball');

    this.setScale(SPRITE_SCALE.iceBall);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const bodySize = 6 * SPRITE_SCALE.iceBall;
    this.body.setAllowGravity(false);
    this.body.setGravityY(0);
    this.body.setSize(bodySize, bodySize);
    this.body.setOffset(
      (this.displayWidth - bodySize) / 2,
      (this.displayHeight - bodySize) / 2
    );
    this.setVelocity(direction * ICE_SPEED, 0);
    this.setDepth(8);

    scene.time.delayedCall(2000, () => {
      if (this.active) this.destroy();
    });
  }
}
