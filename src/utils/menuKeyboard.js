import Phaser from 'phaser';

export function bindMenuKeys(scene, handlers) {
  scene.menuKeyHandlers = handlers;
  scene.menuKeys = scene.input.keyboard.addKeys({
    enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    esc: Phaser.Input.Keyboard.KeyCodes.ESC,
  });
}

export function pollMenuKeys(scene) {
  if (!scene.menuKeys || !scene.menuKeyHandlers) return;

  const { confirm, cancel } = scene.menuKeyHandlers;
  const enter = Phaser.Input.Keyboard.JustDown(scene.menuKeys.enter);
  const space = Phaser.Input.Keyboard.JustDown(scene.menuKeys.space);
  const esc = Phaser.Input.Keyboard.JustDown(scene.menuKeys.esc);

  if (confirm && (enter || space)) {
    confirm();
  } else if (cancel && esc) {
    cancel();
  }
}
