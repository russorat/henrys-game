import { STORAGE_KEYS } from '../config.js';

export default class AudioManager {
  static instance = null;
  static unlocked = false;

  constructor(scene) {
    this.scene = scene;
    this.muted = localStorage.getItem(STORAGE_KEYS.muted) === 'true';
    this.pendingMusic = null;
    AudioManager.instance = this;
  }

  static get() {
    return AudioManager.instance;
  }

  unlockFromGesture() {
    if (AudioManager.unlocked) {
      this.flushPendingMusic();
      return;
    }

    const sound = this.scene.sound;
    if (sound.unlock) {
      sound.unlock();
    }

    const ctx = sound.context;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        AudioManager.unlocked = true;
        this.flushPendingMusic();
      });
      return;
    }

    AudioManager.unlocked = true;
    this.flushPendingMusic();
  }

  flushPendingMusic() {
    if (this.muted || !this.pendingMusic) return;
    const { key, volume } = this.pendingMusic;
    this.pendingMusic = null;
    this.playMusic(key, volume);
  }

  play(key, config = {}) {
    if (this.muted || !AudioManager.unlocked) return;
    if (this.scene.sound.get(key)) {
      this.scene.sound.play(key, { volume: config.volume ?? 0.5, ...config });
    }
  }

  playMusic(key, volume = 0.3) {
    if (this.muted) return;

    if (!AudioManager.unlocked) {
      this.pendingMusic = { key, volume };
      return;
    }

    const existing = this.scene.sound.get(key);
    if (existing?.isPlaying) return;
    this.scene.sound.stopAll();
    this.scene.sound.play(key, { loop: true, volume });
  }

  stopMusic() {
    this.pendingMusic = null;
    this.scene.sound.stopAll();
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem(STORAGE_KEYS.muted, String(this.muted));
    if (this.muted) {
      this.stopMusic();
    } else if (AudioManager.unlocked) {
      this.flushPendingMusic();
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}
