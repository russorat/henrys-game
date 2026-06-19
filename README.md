# Henry's Ice Adventure

A touch-friendly pixel-art side-scrolling platformer built for kids. Play as Henry, jump across platforms, freeze animals with ice balls, and smash through them for points!

## Gameplay

- **Move** with the on-screen left/right buttons
- **Jump** with the JUMP button
- **Freeze** animals with the ice ball button (❄)
- Run into **frozen** animals to explode them and earn points
- Avoid **unfrozen** animals or you'll have to try again
- Beat all 5 levels to win!

| Animal Size | Points |
|-------------|--------|
| Small (bird) | 10 |
| Medium (fox) | 25 |
| Large (bear) | 50 |

## Local Development

```bash
npm install
npm run generate-audio   # creates WAV files in public/assets/audio/
npm run dev              # http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

## Docker / Dokploy Deployment

Build and run locally:

```bash
docker build -t henrys-game .
docker run -p 8080:80 henrys-game
```

Open http://localhost:8080

### Dokploy Setup

1. Create a new **Application** in Dokploy
2. Connect this repository
3. Set **Build Type** to Dockerfile
4. Set **Dockerfile path** to `Dockerfile`
5. Expose port **80**
6. Deploy — no environment variables required

The container serves the static Vite build via nginx.

## Tech Stack

- [Phaser 3](https://phaser.io/) game engine
- [Vite](https://vitejs.dev/) build tool
- nginx (production static file server)
- localStorage for high score persistence
