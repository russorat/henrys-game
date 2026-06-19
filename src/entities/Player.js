import Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_JUMP, ICE_COOLDOWN, SPRITE_SCALE } from '../config.js';
import IceBall, { ICE_SPEED } from './IceBall.js';
import AudioManager from '../systems/AudioManager.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'henry');

    this.setOrigin(0.5, 1);
    this.setScale(SPRITE_SCALE.player);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.refreshBody();
    this.setDepth(10);

    this.facing = 1;
    this.canShoot = true;
    this.isDead = false;
    this.controls = { left: false, right: false, jump: false, freeze: false };
    this.jumpPressed = false;
  }

  refreshBody() {
    const frameW = this.width;
    const frameH = this.height;
    const bodyW = Math.round(frameW * 0.55);
    const bodyH = Math.round(frameH * 0.88);
    this.body.setSize(bodyW, bodyH);
    this.body.setOffset(
      Math.round((frameW - bodyW) / 2),
      Math.round(frameH - bodyH)
    );
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
    const x = this.x + this.facing * (this.displayWidth / 2 + 4);
    const y = this.y - this.displayHeight / 2;
    const ball = new IceBall(this.scene, x, y, this.facing);
    this.scene.iceBalls.add(ball);
    ball.body.setAllowGravity(false);
    ball.setVelocity(this.facing * ICE_SPEED, 0);
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
