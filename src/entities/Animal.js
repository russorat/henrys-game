import Phaser from 'phaser';
import { TILE_SIZE, ANIMAL_CONFIG, PALETTE, FROZEN_DURATION } from '../config.js';
import AudioManager from '../systems/AudioManager.js';

const STATE = {
  ACTIVE: 'active',
  FROZEN: 'frozen',
  EXPLODING: 'exploding',
};

export default class Animal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config, levelTelegraph) {
    const animalConfig = ANIMAL_CONFIG[config.size];
    super(scene, config.x * TILE_SIZE + TILE_SIZE / 2, config.y * TILE_SIZE - animalConfig.height / 2, animalConfig.key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.size = config.size;
    this.animalConfig = animalConfig;
    this.state = STATE.ACTIVE;
    this.patrolStart = this.x;
    this.patrolRange = config.patrolRange || 50;
    this.patrolDirection = 1;
    this.telegraph = levelTelegraph;
    this.telegraphDone = !levelTelegraph;

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(animalConfig.width, animalConfig.height);
    this.body.setOffset(
      (this.width - animalConfig.width) / 2,
      this.height - animalConfig.height
    );
    this.setDepth(5);

    if (this.telegraph) {
      this.preSceneTelegraph();
    }
  }

  preSceneTelegraph() {
    this.setTint(PALETTE.red);
    this.scene.time.delayedCall(300, () => {
      this.clearTint();
      this.telegraphDone = true;
    });
  }

  update() {
    if (this.state === STATE.EXPLODING) return;

    if (this.state === STATE.ACTIVE) {
      this.patrol();
    } else if (this.state === STATE.FROZEN) {
      this.setVelocityX(0);
    }
  }

  patrol() {
    const speed = this.animalConfig.speed * this.patrolDirection;
    this.setVelocityX(speed);

    if (this.x > this.patrolStart + this.patrolRange) {
      this.patrolDirection = -1;
      this.setFlipX(true);
    } else if (this.x < this.patrolStart - this.patrolRange) {
      this.patrolDirection = 1;
      this.setFlipX(false);
    }
  }

  freeze() {
    if (this.state !== STATE.ACTIVE) return;
    this.state = STATE.FROZEN;
    this.setVelocityX(0);
    this.setTint(PALETTE.iceDark);
    AudioManager.get()?.play('sfx-freeze', { volume: 0.4 });

    this.frozenTimer = this.scene.time.delayedCall(FROZEN_DURATION, () => {
      if (this.state === STATE.FROZEN) {
        this.state = STATE.ACTIVE;
        this.clearTint();
      }
    });
  }

  explode() {
    if (this.state !== STATE.FROZEN) return false;

    this.state = STATE.EXPLODING;
    if (this.frozenTimer) this.frozenTimer.remove();

    const points = this.animalConfig.points;
    this.scene.onAnimalExplode(this.x, this.y, points);

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => this.destroy(),
    });

    AudioManager.get()?.play('sfx-explode', { volume: 0.5 });
    return true;
  }

  isActive() {
    return this.state === STATE.ACTIVE && this.telegraphDone;
  }

  isFrozen() {
    return this.state === STATE.FROZEN;
  }
}
