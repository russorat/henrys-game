import Phaser from 'phaser';
import { TILE_SIZE, ANIMAL_CONFIG, PALETTE, FROZEN_DURATION, SPRITE_SCALE, platformTopY } from '../config.js';
import AudioManager from '../systems/AudioManager.js';

const STATE = {
  ACTIVE: 'active',
  FROZEN: 'frozen',
  EXPLODING: 'exploding',
};

export default class Animal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config, levelTelegraph) {
    const animalConfig = ANIMAL_CONFIG[config.size];
    const x = config.x * TILE_SIZE + TILE_SIZE / 2;
    const y = platformTopY(config.y);
    super(scene, x, y, animalConfig.key);

    this.setOrigin(0.5, 1);
    this.setScale(SPRITE_SCALE.animal);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.size = config.size;
    this.animalConfig = animalConfig;
    this.baseScale = SPRITE_SCALE.animal;
    this.state = STATE.ACTIVE;
    this.telegraph = levelTelegraph;
    this.telegraphDone = !levelTelegraph;

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.setVelocityX(0);
    const bodyW = animalConfig.width;
    const bodyH = animalConfig.height;
    this.body.setSize(bodyW, bodyH);
    this.body.setOffset(
      (this.width - bodyW) / 2,
      this.height - bodyH
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
    this.setVelocityX(0);
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
      scaleX: this.baseScale * 1.5,
      scaleY: this.baseScale * 1.5,
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
