import Phaser from 'phaser';

const ICE_SPEED = 350;

export default class IceBall extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction) {
    super(scene, x, y, 'ice-ball');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityX(direction * ICE_SPEED);
    this.body.setAllowGravity(false);
    this.body.setSize(6, 6);
    this.body.setOffset(1, 1);
    this.setDepth(8);

    scene.time.delayedCall(2000, () => {
      if (this.active) this.destroy();
    });
  }
}
