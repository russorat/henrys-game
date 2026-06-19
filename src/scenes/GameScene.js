import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, PALETTE, platformTopY, GROUND_ROW } from '../config.js';
import levels from '../levels/index.js';
import Player from '../entities/Player.js';
import Animal from '../entities/Animal.js';
import IceBall from '../entities/IceBall.js';
import TouchControls from '../ui/TouchControls.js';
import KeyboardControls, { mergeInput } from '../ui/KeyboardControls.js';
import HUD from '../ui/HUD.js';
import { ScoreManager, HighScoreManager } from '../systems/ScoreManager.js';
import AudioManager from '../systems/AudioManager.js';
import { createExplosion } from '../ui/Fireworks.js';
import { focusGameCanvas, setupKeyboardCapture } from '../utils/keyboardSetup.js';

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
    this.physics.world.OVERLAP_BIAS = 24;

    this.add.rectangle(level.length / 2, GAME_HEIGHT / 2, level.length, GAME_HEIGHT, PALETTE.sky);

    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    this.buildPlatforms(level);
    this.placeFinishArea(level);

    this.iceBalls = this.physics.add.group({ allowGravity: false });
    this.animalList = [];
    this.animalsSpawned = false;

    const startPlatform = level.platforms[0];
    const platformTop = platformTopY(startPlatform.y);
    this.playerStartX = GAME_WIDTH / 2;
    this.player = new Player(this, this.playerStartX, platformTop);
    this.player.body.updateFromGameObject();
    this.spawnInvincibleUntil = this.time.now + 1000;
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);

    this.physics.add.overlap(this.player, this.animalList, this.handlePlayerAnimal, null, this);
    this.physics.add.overlap(this.iceBalls, this.animalList, this.handleIceAnimal, null, this);

    this.cameras.main.setBounds(0, 0, level.length, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0);
    this.cameras.main.setDeadzone(120, GAME_HEIGHT);

    this.levelEndX = level.length - 120;

    this.touchControls = new TouchControls(this);
    this.keyboardControls = new KeyboardControls(this);
    setupKeyboardCapture(this);
    focusGameCanvas(this);

    this.input.on('pointerdown', () => {
      AudioManager.get()?.unlockFromGesture();
      focusGameCanvas(this);
    });

    this.hud = new HUD(this, this.scoreManager, this.highScoreManager);
    this.hud.setLevel(this.levelIndex + 1);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 14, '← → / A D   Space / W jump   F / Z freeze', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#455a64',
    }).setOrigin(0.5).setDepth(100).setScrollFactor(0);
  }

  spawnAnimals() {
    if (this.animalsSpawned) return;
    this.animalsSpawned = true;

    this.levelData.animals.forEach((animalConfig) => {
      const animal = new Animal(this, animalConfig, this.levelData.telegraph);
      this.animalList.push(animal);
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

  placeFinishArea(level) {
    const groundRow = GROUND_ROW;
    const endTile = Math.floor(level.length / TILE_SIZE);
    const padStart = Math.max(0, endTile - 4);

    for (let tileX = padStart; tileX < endTile; tileX++) {
      const x = tileX * TILE_SIZE + TILE_SIZE / 2;
      const y = groundRow * TILE_SIZE + TILE_SIZE / 2;
      const tile = this.platforms.create(x, y, 'platform');
      tile.refreshBody();
    }

    const flagX = level.length - 56;
    const flagY = platformTopY(groundRow);
    const flag = this.add.sprite(flagX, flagY, 'finish-flag')
      .setOrigin(0.5, 1)
      .setScale(2.5)
      .setDepth(6);

    this.tweens.add({
      targets: flag,
      angle: { from: -4, to: 4 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add.text(flagX, flagY - flag.displayHeight - 8, 'GOAL', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffd54f',
      stroke: '#5d4037',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(6);
  }

  handlePlayerAnimal(obj1, obj2) {
    const player = obj1 instanceof Player ? obj1 : obj2;
    const animal = obj1 instanceof Animal ? obj1 : obj2;
    if (!(player instanceof Player) || !(animal instanceof Animal)) return;
    if (player.isDead || this.deathHandled) return;
    if (this.time.now < this.spawnInvincibleUntil) return;

    if (animal.isFrozen()) {
      animal.explode();
    } else if (animal.isActive()) {
      player.die();
    }
  }

  handleIceAnimal(obj1, obj2) {
    const iceBall = obj1 instanceof IceBall ? obj1 : obj2;
    const animal = obj1 instanceof Animal ? obj1 : obj2;
    if (!(iceBall instanceof IceBall) || !(animal instanceof Animal)) return;
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

    const controls = mergeInput(
      this.touchControls.state,
      this.keyboardControls.getState()
    );
    this.player.setControls(controls);
    this.player.update();

    if (!this.animalsSpawned && this.player.x > this.playerStartX + 16) {
      this.spawnAnimals();
    }

    this.animalList.forEach((animal) => {
      if (animal.active) animal.update();
    });

    if (this.player.x >= this.levelEndX) {
      this.completeLevel();
    }

    if (this.player.y > GAME_HEIGHT + 32 && !this.player.isDead) {
      this.player.die();
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
