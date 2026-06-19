import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, PALETTE } from '../config.js';
import levels from '../levels/index.js';
import Player from '../entities/Player.js';
import Animal from '../entities/Animal.js';
import TouchControls from '../ui/TouchControls.js';
import HUD from '../ui/HUD.js';
import { ScoreManager, HighScoreManager } from '../systems/ScoreManager.js';
import AudioManager from '../systems/AudioManager.js';
import { createExplosion } from '../ui/Fireworks.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
    this.runScore = data.score ?? 0;
    this.isNewGame = data.newGame ?? false;
  }

  create() {
    const level = levels[this.levelIndex];
    this.levelData = level;
    this.levelComplete = false;
    this.deathHandled = false;

    this.scoreManager = new ScoreManager();
    this.scoreManager.score = this.runScore;
    this.highScoreManager = new HighScoreManager();

    new AudioManager(this);
    const audio = AudioManager.get();
    if (!audio.isMuted()) {
      audio.playMusic('music-game', 0.25);
    }

    this.physics.world.setBounds(0, 0, level.length, GAME_HEIGHT);

    this.add.rectangle(level.length / 2, GAME_HEIGHT / 2, level.length, GAME_HEIGHT, PALETTE.sky);

    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    this.buildPlatforms(level);

    this.iceBalls = this.physics.add.group();
    this.animals = this.physics.add.group();

    level.animals.forEach((animalConfig) => {
      const animal = new Animal(this, animalConfig, level.telegraph);
      this.animals.add(animal);
    });

    const startPlatform = level.platforms[0];
    this.player = new Player(this, 80, startPlatform.y * TILE_SIZE - 28);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);

    this.physics.add.overlap(this.player, this.animals, this.handlePlayerAnimal, null, this);
    this.physics.add.overlap(this.iceBalls, this.animals, this.handleIceAnimal, null, this);

    this.cameras.main.setBounds(0, 0, level.length, GAME_HEIGHT);
    this.cameras.main.setScroll(0, 0);

    this.scrollSpeed = level.scrollSpeed;
    this.controls = { left: false, right: false, jump: false, freeze: false };

    this.touchControls = new TouchControls(this, (state) => {
      this.controls = state;
    });

    this.hud = new HUD(this, this.scoreManager, this.highScoreManager);
    this.hud.setLevel(this.levelIndex + 1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.deathZone = this.add.rectangle(0, GAME_HEIGHT + 20, level.length, 40, 0x000000, 0);
    this.physics.add.existing(this.deathZone);
    this.deathZone.body.setAllowGravity(false);
    this.deathZone.body.setImmovable(true);
    this.physics.add.overlap(this.player, this.deathZone, () => {
      if (!this.player.isDead) this.player.die();
    });
  }

  buildPlatforms(level) {
    level.platforms.forEach((p) => {
      if (p.moveY) {
        const centerX = (p.x + p.width / 2) * TILE_SIZE;
        const centerY = p.y * TILE_SIZE + TILE_SIZE / 2;
        const mover = this.movingPlatforms.create(centerX, centerY, 'platform');
        mover.setDisplaySize(p.width * TILE_SIZE, TILE_SIZE);
        mover.body.setSize(p.width * TILE_SIZE, TILE_SIZE);
        mover.body.setAllowGravity(false);
        mover.body.setImmovable(true);
        mover.setDepth(1);
        mover.body.updateFromGameObject();

        this.tweens.add({
          targets: mover,
          y: centerY + p.moveY,
          duration: p.moveSpeed,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            mover.body.updateFromGameObject();
          },
        });
      } else {
        for (let i = 0; i < p.width; i++) {
          const x = (p.x + i) * TILE_SIZE + TILE_SIZE / 2;
          const y = p.y * TILE_SIZE + TILE_SIZE / 2;
          const tile = this.platforms.create(x, y, 'platform');
          tile.refreshBody();
        }
      }
    });
  }

  handlePlayerAnimal(player, animal) {
    if (player.isDead || this.deathHandled) return;

    if (animal.isFrozen()) {
      animal.explode();
    } else if (animal.isActive()) {
      player.die();
    }
  }

  handleIceAnimal(iceBall, animal) {
    if (!iceBall.active || !animal.active) return;
    animal.freeze();
    iceBall.destroy();
  }

  onAnimalExplode(x, y, points) {
    createExplosion(this, x, y);
    this.scoreManager.add(points);
    this.hud.update();
    AudioManager.get()?.play('sfx-score', { volume: 0.3 });
  }

  onPlayerDie() {
    if (this.deathHandled) return;
    this.deathHandled = true;

    this.time.delayedCall(800, () => {
      this.scene.start('GameOverScene', {
        levelIndex: this.levelIndex,
        score: this.scoreManager.get(),
      });
    });
  }

  update(time, delta) {
    if (this.player.isDead || this.levelComplete) return;

    this.controls.left = this.controls.left || this.cursors.left.isDown;
    this.controls.right = this.controls.right || this.cursors.right.isDown;
    this.controls.jump = this.controls.jump || this.cursors.up.isDown || this.keySpace.isDown;
    this.controls.freeze = this.controls.freeze || this.keyF.isDown;

    this.player.setControls(this.controls);
    this.player.update();

    this.animals.children.entries.forEach((animal) => animal.update());

    const scrollDelta = (this.scrollSpeed * delta) / 1000;
    this.cameras.main.scrollX += scrollDelta;

    const minX = this.cameras.main.scrollX + 60;
    if (this.player.x < minX) {
      this.player.x = minX;
    }

    const endX = this.levelData.length - GAME_WIDTH + 100;
    if (this.cameras.main.scrollX >= endX) {
      this.completeLevel();
    }
  }

  completeLevel() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    AudioManager.get()?.play('sfx-level', { volume: 0.5 });

    this.time.delayedCall(500, () => {
      const score = this.scoreManager.get();
      const isLastLevel = this.levelIndex >= levels.length - 1;

      if (isLastLevel) {
        const newHighScore = this.highScoreManager.checkAndUpdate(score);
        this.scene.start('VictoryScene', { score, newHighScore });
      } else {
        this.scene.start('LevelCompleteScene', {
          levelIndex: this.levelIndex,
          score,
        });
      }
    });
  }
}
