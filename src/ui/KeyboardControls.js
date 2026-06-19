import Phaser from 'phaser';
import { isDown } from '../utils/keyboardSetup.js';

export default class KeyboardControls {
  constructor(scene) {
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      f: Phaser.Input.Keyboard.KeyCodes.F,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
    });
  }

  getState() {
    return {
      left: isDown(this.keys.left) || isDown(this.keys.a),
      right: isDown(this.keys.right) || isDown(this.keys.d),
      jump: isDown(this.keys.up) || isDown(this.keys.w) || isDown(this.keys.space),
      freeze: isDown(this.keys.f) || isDown(this.keys.z),
    };
  }
}

export function mergeInput(touchState, keyboardState) {
  return {
    left: touchState.left || keyboardState.left,
    right: touchState.right || keyboardState.right,
    jump: touchState.jump || keyboardState.jump,
    freeze: touchState.freeze || keyboardState.freeze,
  };
}
