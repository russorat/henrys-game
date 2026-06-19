export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;

export const TILE_SIZE = 32;

/** Main ground tile row — kept above on-screen touch controls. */
export const GROUND_ROW = 10;

/** Y coordinate of the walkable top edge for a platform tile row. */
export function platformTopY(tileRow) {
  return tileRow * TILE_SIZE;
}

export const PALETTE = {
  sky: 0x87ceeb,
  skyDark: 0x5ba3d9,
  ground: 0x5d4037,
  grass: 0x4caf50,
  grassDark: 0x388e3c,
  henrySkin: 0xffcc80,
  henryShirt: 0x42a5f5,
  henryHat: 0x8d6e63,
  henryPants: 0x5c6bc0,
  henryBackpack: 0xff7043,
  ice: 0xb3e5fc,
  iceDark: 0x4fc3f7,
  white: 0xffffff,
  black: 0x212121,
  bird: 0xffeb3b,
  fox: 0xff7043,
  bear: 0x795548,
  uiBg: 0x263238,
  uiBorder: 0x4fc3f7,
  red: 0xe53935,
  gold: 0xffd54f,
};

export const ANIMAL_CONFIG = {
  small: { key: 'animal-small', points: 10, speed: 40, width: 16, height: 12 },
  medium: { key: 'animal-medium', points: 25, speed: 60, width: 24, height: 18 },
  large: { key: 'animal-large', points: 50, speed: 30, width: 32, height: 24 },
};

export const SPRITE_SCALE = {
  player: 3,
  animal: 3,
  iceBall: 2.5,
};

export const PLAYER_SPEED = 200;
export const PLAYER_JUMP = -380;
export const ICE_COOLDOWN = 500;
export const FROZEN_DURATION = 2000;
export const SCROLL_SPEED_BASE = 80;

export const STORAGE_KEYS = {
  highScore: 'henrys-game-highscore',
  muted: 'henrys-game-muted',
};
