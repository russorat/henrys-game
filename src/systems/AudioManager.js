import { STORAGE_KEYS } from '../config.js';

export default class AudioManager {
  static instance = null;

  constructor(scene) {
    this.scene = scene;
    this.muted = localStorage.getItem(STORAGE_KEYS.muted) === 'true';
    AudioManager.instance = this;
  }

  static get() {
    return AudioManager.instance;
  }

  play(key, config = {}) {
    if (this.muted) return;
    if (this.scene.sound.get(key)) {
      this.scene.sound.play(key, { volume: config.volume ?? 0.5, ...config });
    }
  }

  playMusic(key, volume = 0.3) {
    if (this.muted) return;
    const existing = this.scene.sound.get(key);
    if (existing?.isPlaying) return;
    this.scene.sound.stopAll();
    this.scene.sound.play(key, { loop: true, volume });
  }

  stopMusic() {
    this.scene.sound.stopAll();
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem(STORAGE_KEYS.muted, String(this.muted));
    if (this.muted) {
      this.scene.sound.stopAll();
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}
