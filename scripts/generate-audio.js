import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/assets/audio');

function writeWav(filename, samples, sampleRate = 22050) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }

  fs.writeFileSync(path.join(outDir, filename), buffer);
}

function tone(freq, duration, volume = 0.3, sampleRate = 22050) {
  const len = Math.floor(sampleRate * duration);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const env = Math.min(1, i / (sampleRate * 0.01)) * Math.max(0, 1 - (i - len * 0.7) / (len * 0.3));
    samples[i] = Math.sin(2 * Math.PI * freq * t) * volume * env;
  }
  return samples;
}

function concat(...arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const arr of arrays) {
    out.set(arr, offset);
    offset += arr.length;
  }
  return out;
}

function silence(duration, sampleRate = 22050) {
  return new Float32Array(Math.floor(sampleRate * duration));
}

function noise(duration, volume = 0.2, sampleRate = 22050) {
  const len = Math.floor(sampleRate * duration);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const env = Math.max(0, 1 - i / len);
    samples[i] = (Math.random() * 2 - 1) * volume * env;
  }
  return samples;
}

function melody(notes, noteLen = 0.15, sampleRate = 22050) {
  const parts = notes.map((freq) => (freq ? tone(freq, noteLen, 0.2) : silence(noteLen)));
  return concat(...parts);
}

fs.mkdirSync(outDir, { recursive: true });

// SFX
writeWav('sfx-jump.wav', tone(440, 0.12, 0.35));
writeWav('sfx-shoot.wav', concat(tone(880, 0.05, 0.3), tone(1200, 0.08, 0.25)));
writeWav('sfx-freeze.wav', concat(tone(600, 0.1, 0.3), tone(900, 0.15, 0.25)));
writeWav('sfx-explode.wav', noise(0.25, 0.4));
writeWav('sfx-die.wav', concat(tone(300, 0.2, 0.3), tone(200, 0.3, 0.25), tone(150, 0.4, 0.2)));
writeWav('sfx-level.wav', melody([523, 659, 784, 1047], 0.12));
writeWav('sfx-score.wav', tone(1047, 0.1, 0.25));

// Music - cheerful looping melodies
const menuNotes = [523, 587, 659, 698, 784, 698, 659, 587, 523, 587, 659, 784];
const menuParts = [];
for (let loop = 0; loop < 4; loop++) {
  menuParts.push(melody(menuNotes, 0.2));
  menuParts.push(silence(0.1));
}
writeWav('music-menu.wav', concat(...menuParts));

const gameNotes = [392, 440, 494, 440, 392, 349, 392, 440, 494, 523, 494, 440];
const gameParts = [];
for (let loop = 0; loop < 6; loop++) {
  gameParts.push(melody(gameNotes, 0.18));
  gameParts.push(silence(0.05));
}
writeWav('music-game.wav', concat(...gameParts));

console.log('Audio files generated in', outDir);
