import Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_JUMP, ICE_COOLDOWN } from '../config.js';
import IceBall from './IceBall.js';
import AudioManager from '../systems/AudioManager.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'henry');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.body.setSize(12, 20);
    this.body.setOffset(2, 4);
    this.setDepth(10);

    this.facing = 1;
    this.canShoot = true;
    this.isDead = false;
    this.controls = { left: false, right: false, jump: false, freeze: false };
    this.jumpPressed = false;
  }

  setControls(controls) {
    this.controls = controls;
  }

  update() {
    if (this.isDead) return;

    const onGround = this.body.blocked.down || this.body.touching.down;

    if (this.controls.left) {
      this.setVelocityX(-PLAYER_SPEED);
      this.facing = -1;
      this.setFlipX(true);
    } else if (this.controls.right) {
      this.setVelocityX(PLAYER_SPEED);
      this.facing = 1;
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (this.controls.jump && onGround && !this.jumpPressed) {
      this.setVelocityY(PLAYER_JUMP);
      this.jumpPressed = true;
      AudioManager.get()?.play('sfx-jump', { volume: 0.4 });
    }

    if (!this.controls.jump) {
      this.jumpPressed = false;
    }

    if (this.controls.freeze && this.canShoot) {
      this.shoot();
    }
  }

  shoot() {
    this.canShoot = false;
    const x = this.x + this.facing * 16;
    const y = this.y;
    const ball = new IceBall(this.scene, x, y, this.facing);
    this.scene.iceBalls.add(ball);
    AudioManager.get()?.play('sfx-shoot', { volume: 0.35 });

    this.scene.time.delayedCall(ICE_COOLDOWN, () => {
      this.canShoot = true;
    });
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.setVelocity(0, -200);
    this.setTint(0xff0000);
    AudioManager.get()?.play('sfx-die', { volume: 0.5 });
    this.scene.onPlayerDie();
  }
}
