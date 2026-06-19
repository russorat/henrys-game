export default {
  scrollSpeed: 105,
  length: 3600,
  telegraph: false,
  platforms: [
    { x: 0, y: 13, width: 12 },
    { x: 16, y: 13, width: 10 },
    { x: 30, y: 11, width: 8, moveY: 30, moveSpeed: 2000 },
    { x: 44, y: 13, width: 10 },
    { x: 58, y: 10, width: 8 },
    { x: 70, y: 13, width: 8, moveY: 25, moveSpeed: 1800 },
    { x: 82, y: 11, width: 12 },
  ],
  animals: [
    { x: 5, y: 13, size: 'medium', patrolRange: 50 },
    { x: 20, y: 13, size: 'small', patrolRange: 40 },
    { x: 32, y: 11, size: 'medium', patrolRange: 35 },
    { x: 48, y: 13, size: 'large', patrolRange: 30 },
    { x: 60, y: 10, size: 'medium', patrolRange: 30 },
    { x: 72, y: 13, size: 'large', patrolRange: 25 },
    { x: 86, y: 11, size: 'medium', patrolRange: 40 },
  ],
};
