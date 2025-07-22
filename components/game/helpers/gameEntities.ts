import * as Phaser from 'phaser';
import { createPhysicsGraphics } from './phaserHelpers';

export function createFish(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Sprite {
  // Create sprite using loaded fish image
  const fish = scene.add.sprite(x, y, 'fish');
  
  // Scale the fish to appropriate size (adjust based on original image size)
  fish.setScale(0.15); // Start with a smaller scale, can adjust if needed
  
  // Add physics body with custom size
  const fishBody = scene.matter.add.gameObject(fish, {
    shape: {
      type: 'rectangle',
      width: 60,  // Physics body size
      height: 45
    }
  } as any);
  
  // Set physics properties
  fishBody.setFriction(0.5);
  fishBody.setFrictionStatic(0.8);
  fishBody.setBounce(0.2);
  
  return fish;
}

export function createHamster(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Sprite {
  // Create sprite using loaded hamster image
  const hamster = scene.add.sprite(x, y, 'hamster');
  
  // Scale the hamster to appropriate size
  hamster.setScale(0.12); // Start with a smaller scale, can adjust if needed
  
  // Add physics body with custom size
  const hamsterBody = scene.matter.add.gameObject(hamster, {
    shape: {
      type: 'rectangle',
      width: 50,  // Physics body size
      height: 35
    }
  } as any);
  
  // Set physics properties
  hamsterBody.setFriction(0.5);
  hamsterBody.setFrictionStatic(0.8);
  hamsterBody.setBounce(0.3);
  
  return hamster;
}

export function createStar(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Graphics {
  const star = scene.add.graphics();
  star.setPosition(x, y);
  
  // Create star shape
  const starPath = new Phaser.Geom.Polygon([
    { x: 0, y: -12 },
    { x: 4, y: -4 },
    { x: 12, y: -4 },
    { x: 6, y: 2 },
    { x: 8, y: 10 },
    { x: 0, y: 6 },
    { x: -8, y: 10 },
    { x: -6, y: 2 },
    { x: -12, y: -4 },
    { x: -4, y: -4 }
  ]);
  
  star.fillStyle(0xFFD700); // Golden star
  star.fillPoints(starPath.points, true);
  star.lineStyle(2, 0xFFB000);
  star.strokePoints(starPath.points, true);
  
  // Add sparkle animation
  scene.tweens.add({
    targets: star,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 500,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });
  
  // Add rotation animation
  scene.tweens.add({
    targets: star,
    rotation: Math.PI * 2,
    duration: 2000,
    repeat: -1,
    ease: 'Linear'
  });
  
  return star;
}

export function updateFish(fish: Phaser.GameObjects.Sprite): void {
  const fishBody = fish.body as MatterJS.BodyType;
  
  // Flip fish based on movement direction
  if (fishBody.velocity.x > 0.5) {
    fish.setFlipX(false);
  } else if (fishBody.velocity.x < -0.5) {
    fish.setFlipX(true);
  }
  
  // Add subtle swimming animation
  const swimOffset = Math.sin(Date.now() * 0.005) * 3;
  fish.setRotation(swimOffset * 0.02);
}

export function updateHamster(hamster: Phaser.GameObjects.Sprite): void {
  const hamsterBody = hamster.body as MatterJS.BodyType;
  
  // Flip hamster based on movement direction
  if (hamsterBody.velocity.x > 0.3) {
    hamster.setFlipX(false);
  } else if (hamsterBody.velocity.x < -0.3) {
    hamster.setFlipX(true);
  }
  
  // Add subtle bounce animation when moving
  const speed = Math.abs(hamsterBody.velocity.x);
  if (speed > 0.5) {
    const bounceOffset = Math.sin(Date.now() * 0.01) * 2;
    const baseY = hamster.y;
    hamster.setY(baseY + bounceOffset * 0.1);
  }
}