import Phaser from 'phaser';

const GAME_KEY_CODES = [
  Phaser.Input.Keyboard.KeyCodes.SPACE,
  Phaser.Input.Keyboard.KeyCodes.UP,
  Phaser.Input.Keyboard.KeyCodes.DOWN,
  Phaser.Input.Keyboard.KeyCodes.LEFT,
  Phaser.Input.Keyboard.KeyCodes.RIGHT,
  Phaser.Input.Keyboard.KeyCodes.W,
  Phaser.Input.Keyboard.KeyCodes.A,
  Phaser.Input.Keyboard.KeyCodes.S,
  Phaser.Input.Keyboard.KeyCodes.D,
  Phaser.Input.Keyboard.KeyCodes.F,
  Phaser.Input.Keyboard.KeyCodes.Z,
  Phaser.Input.Keyboard.KeyCodes.ENTER,
  Phaser.Input.Keyboard.KeyCodes.ESC,
];

export function focusGameCanvas(scene) {
  const canvas = scene.game.canvas;
  if (!canvas) return;
  canvas.setAttribute('tabindex', '1');
  canvas.style.outline = 'none';
  if (document.activeElement !== canvas) {
    canvas.focus({ preventScroll: true });
  }
}

export function setupKeyboardCapture(scene) {
  const keyboard = scene.input.keyboard;
  if (!keyboard) return;
  keyboard.enabled = true;
  keyboard.clearCaptures();
  keyboard.addCapture(GAME_KEY_CODES);
}

export function isJustDown(key) {
  return key && Phaser.Input.Keyboard.JustDown(key);
}

export function isDown(key) {
  return key && key.isDown;
}
