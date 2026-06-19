import { PALETTE } from '../config.js';

function setPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function colorHex(n) {
  return '#' + n.toString(16).padStart(6, '0');
}

export function createHenryTexture(scene) {
  const w = 16;
  const h = 24;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const skin = colorHex(PALETTE.henrySkin);
  const shirt = colorHex(PALETTE.henryShirt);
  const hat = colorHex(PALETTE.henryHat);
  const pants = colorHex(PALETTE.henryPants);
  const backpack = colorHex(PALETTE.henryBackpack);
  const black = colorHex(PALETTE.black);

  // Hat
  for (let x = 4; x < 12; x++) setPixel(ctx, x, 0, hat);
  for (let x = 3; x < 13; x++) setPixel(ctx, x, 1, hat);
  for (let x = 5; x < 11; x++) setPixel(ctx, x, 2, hat);

  // Face
  for (let y = 3; y < 8; y++) {
    for (let x = 5; x < 11; x++) setPixel(ctx, x, y, skin);
  }
  setPixel(ctx, 6, 5, black);
  setPixel(ctx, 9, 5, black);

  // Body / shirt
  for (let y = 8; y < 15; y++) {
    for (let x = 4; x < 12; x++) setPixel(ctx, x, y, shirt);
  }

  // Backpack
  for (let y = 9; y < 14; y++) {
    setPixel(ctx, 3, y, backpack);
    setPixel(ctx, 12, y, backpack);
  }

  // Arms
  for (let y = 9; y < 13; y++) {
    setPixel(ctx, 3, y, skin);
    setPixel(ctx, 12, y, skin);
  }

  // Pants
  for (let y = 15; y < 20; y++) {
    for (let x = 5; x < 11; x++) setPixel(ctx, x, y, pants);
  }

  // Legs
  for (let y = 20; y < 24; y++) {
    setPixel(ctx, 5, y, pants);
    setPixel(ctx, 6, y, pants);
    setPixel(ctx, 9, y, pants);
    setPixel(ctx, 10, y, pants);
  }

  // Shoes
  setPixel(ctx, 4, 23, black);
  setPixel(ctx, 5, 23, black);
  setPixel(ctx, 9, 23, black);
  setPixel(ctx, 10, 23, black);

  scene.textures.addCanvas('henry', canvas);
}

export function createAnimalTextures(scene) {
  createBird(scene);
  createFox(scene);
  createBear(scene);
}

function createBird(scene) {
  const w = 16;
  const h = 12;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const yellow = colorHex(PALETTE.bird);
  const orange = '#ff9800';
  const black = colorHex(PALETTE.black);

  for (let x = 4; x < 12; x++) setPixel(ctx, x, 4, yellow);
  for (let x = 3; x < 13; x++) setPixel(ctx, x, 5, yellow);
  for (let x = 2; x < 14; x++) setPixel(ctx, x, 6, yellow);
  setPixel(ctx, 1, 5, yellow);
  setPixel(ctx, 14, 5, yellow);
  setPixel(ctx, 13, 6, orange);
  setPixel(ctx, 7, 7, orange);
  setPixel(ctx, 10, 5, black);
  scene.textures.addCanvas('animal-small', canvas);
}

function createFox(scene) {
  const w = 24;
  const h = 18;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const orange = colorHex(PALETTE.fox);
  const white = colorHex(PALETTE.white);
  const black = colorHex(PALETTE.black);

  for (let x = 6; x < 18; x++) setPixel(ctx, x, 6, orange);
  for (let x = 4; x < 20; x++) setPixel(ctx, x, 7, orange);
  for (let x = 3; x < 21; x++) setPixel(ctx, x, 8, orange);
  for (let x = 4; x < 20; x++) setPixel(ctx, x, 9, orange);
  for (let x = 5; x < 19; x++) setPixel(ctx, x, 10, orange);
  for (let x = 6; x < 18; x++) setPixel(ctx, x, 11, orange);
  for (let x = 2; x < 6; x++) setPixel(ctx, x, 4, orange);
  for (let x = 18; x < 22; x++) setPixel(ctx, x, 4, orange);
  for (let x = 7; x < 11; x++) setPixel(ctx, x, 10, white);
  setPixel(ctx, 8, 8, black);
  setPixel(ctx, 14, 8, black);
  for (let x = 7; x < 17; x++) setPixel(ctx, x, 13, orange);
  for (let x = 8; x < 16; x++) setPixel(ctx, x, 14, orange);
  scene.textures.addCanvas('animal-medium', canvas);
}

function createBear(scene) {
  const w = 32;
  const h = 24;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const brown = colorHex(PALETTE.bear);
  const dark = '#5d4037';
  const black = colorHex(PALETTE.black);

  for (let x = 8; x < 24; x++) setPixel(ctx, x, 6, brown);
  for (let x = 6; x < 26; x++) setPixel(ctx, x, 7, brown);
  for (let x = 4; x < 28; x++) {
    for (let y = 8; y < 18; y++) setPixel(ctx, x, y, brown);
  }
  for (let x = 6; x < 26; x++) setPixel(ctx, x, 18, brown);
  for (let x = 8; x < 24; x++) setPixel(ctx, x, 19, brown);
  setPixel(ctx, 4, 6, brown);
  setPixel(ctx, 5, 5, brown);
  setPixel(ctx, 27, 6, brown);
  setPixel(ctx, 26, 5, brown);
  setPixel(ctx, 12, 11, black);
  setPixel(ctx, 20, 11, black);
  setPixel(ctx, 16, 14, dark);
  for (let x = 10; x < 22; x++) setPixel(ctx, x, 20, dark);
  scene.textures.addCanvas('animal-large', canvas);
}

export function createIceBallTexture(scene) {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  const ice = colorHex(PALETTE.ice);
  const iceDark = colorHex(PALETTE.iceDark);
  const white = colorHex(PALETTE.white);

  for (let y = 1; y < 7; y++) {
    for (let x = 1; x < 7; x++) setPixel(ctx, x, y, ice);
  }
  setPixel(ctx, 3, 2, white);
  setPixel(ctx, 4, 3, white);
  setPixel(ctx, 5, 4, iceDark);
  setPixel(ctx, 2, 5, iceDark);
  scene.textures.addCanvas('ice-ball', canvas);
}

export function createPlatformTextures(scene) {
  const w = 32;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const grass = colorHex(PALETTE.grass);
  const grassDark = colorHex(PALETTE.grassDark);
  const ground = colorHex(PALETTE.ground);

  for (let x = 0; x < w; x++) setPixel(ctx, x, 0, grass);
  for (let x = 0; x < w; x++) {
    if (x % 4 === 0) setPixel(ctx, x, 0, grassDark);
  }
  for (let y = 1; y < h; y++) {
    for (let x = 0; x < w; x++) {
      setPixel(ctx, x, y, (x + y) % 3 === 0 ? ground : '#6d4c41');
    }
  }
  scene.textures.addCanvas('platform', canvas);
}

export function createFinishFlagTexture(scene) {
  const w = 16;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const pole = colorHex(PALETTE.henryHat);
  const gold = colorHex(PALETTE.gold);
  const green = colorHex(PALETTE.grass);
  const white = colorHex(PALETTE.white);

  // Pole
  for (let y = 6; y < h; y++) {
    setPixel(ctx, 3, y, pole);
    setPixel(ctx, 4, y, pole);
  }

  // Flag — gold and green checker
  for (let y = 2; y < 14; y++) {
    for (let x = 5; x < 15; x++) {
      const color = (x + y) % 2 === 0 ? gold : green;
      setPixel(ctx, x, y, color);
    }
  }

  // Pole ball
  setPixel(ctx, 3, 5, gold);
  setPixel(ctx, 4, 5, gold);
  setPixel(ctx, 3, 4, white);
  setPixel(ctx, 4, 4, white);

  scene.textures.addCanvas('finish-flag', canvas);
}

export function createParticleTexture(scene) {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 4;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = colorHex(PALETTE.white);
  ctx.fillRect(0, 0, 4, 4);
  scene.textures.addCanvas('particle', canvas);
}

export function createUIButtonTexture(scene, key, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const fill = colorHex(color);
  const border = colorHex(PALETTE.uiBorder);
  ctx.fillStyle = fill;
  ctx.fillRect(4, 4, 56, 56);
  ctx.fillStyle = border;
  for (let i = 0; i < 64; i++) {
    setPixel(ctx, i, 0, border);
    setPixel(ctx, i, 63, border);
    setPixel(ctx, 0, i, border);
    setPixel(ctx, 63, i, border);
  }
  scene.textures.addCanvas(key, canvas);
}
