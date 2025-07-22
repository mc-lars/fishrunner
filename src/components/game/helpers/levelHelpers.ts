import * as Phaser from 'phaser';
import { createPhysicsShape } from './phaserHelpers';

export function createBoundaries(scene: Phaser.Scene): void {
  const width = 800;
  const height = 500;
  const wallThickness = 20;
  
  // Ground
  createPhysicsShape(scene, width / 2, height - wallThickness / 2, width, wallThickness, 0x8B4513, true);
  
  // Left wall
  createPhysicsShape(scene, wallThickness / 2, height / 2, wallThickness, height, 0x8B4513, true);
  
  // Right wall
  createPhysicsShape(scene, width - wallThickness / 2, height / 2, wallThickness, height, 0x8B4513, true);
  
  // Ceiling (higher up to give more space)
  createPhysicsShape(scene, width / 2, wallThickness / 2, width, wallThickness, 0x8B4513, true);
}

export function createPlatforms(scene: Phaser.Scene): Phaser.GameObjects.Group {
  const platforms = scene.add.group();
  
  // Platform configurations - creating a Mario-like level layout
  const platformConfigs = [
    // Lower platforms
    { x: 150, y: 400, width: 120, height: 20 },
    { x: 350, y: 370, width: 100, height: 20 },
    { x: 550, y: 400, width: 120, height: 20 },
    { x: 700, y: 370, width: 80, height: 20 },
    
    // Middle platforms
    { x: 200, y: 300, width: 80, height: 20 },
    { x: 400, y: 280, width: 100, height: 20 },
    { x: 600, y: 300, width: 80, height: 20 },
    
    // Upper platforms
    { x: 100, y: 200, width: 100, height: 20 },
    { x: 300, y: 180, width: 80, height: 20 },
    { x: 500, y: 200, width: 100, height: 20 },
    { x: 650, y: 180, width: 80, height: 20 },
    
    // Top platforms
    { x: 250, y: 120, width: 90, height: 20 },
    { x: 550, y: 100, width: 90, height: 20 },
    
    // Some additional challenge platforms
    { x: 50, y: 320, width: 60, height: 20 },
    { x: 750, y: 280, width: 60, height: 20 },
  ];
  
  platformConfigs.forEach(config => {
    const platform = createPlatform(scene, config.x, config.y, config.width, config.height);
    platforms.add(platform);
  });
  
  return platforms;
}

function createPlatform(scene: Phaser.Scene, x: number, y: number, width: number, height: number): Phaser.GameObjects.Rectangle {
  const platform = createPhysicsShape(scene, x, y, width, height, 0x4CAF50, true);
  
  // Add platform decoration/texture
  const graphics = scene.add.graphics();
  graphics.setPosition(x - width/2, y - height/2);
  
  // Platform surface
  graphics.fillStyle(0x4CAF50);
  graphics.fillRect(0, 0, width, height);
  
  // Platform edges
  graphics.lineStyle(2, 0x2E7D32);
  graphics.strokeRect(0, 0, width, height);
  
  // Grass texture on top
  graphics.lineStyle(1, 0x388E3C);
  for (let i = 2; i < width - 2; i += 4) {
    graphics.beginPath();
    graphics.moveTo(i, 0);
    graphics.lineTo(i + 1, -3);
    graphics.lineTo(i + 2, 0);
    graphics.strokePath();
  }
  
  return platform;
}

// Helper to create decorative background elements
export function createBackgroundElements(scene: Phaser.Scene): void {
  // Create some clouds in the background
  for (let i = 0; i < 5; i++) {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(30, 150);
    createCloud(scene, x, y);
  }
  
  // Create some underwater bubbles (since we have a fish!)
  for (let i = 0; i < 8; i++) {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(200, 450);
    createBubble(scene, x, y);
  }
}

function createCloud(scene: Phaser.Scene, x: number, y: number): void {
  const cloud = scene.add.graphics();
  cloud.setPosition(x, y);
  cloud.setAlpha(0.7);
  
  cloud.fillStyle(0xFFFFFF);
  cloud.fillCircle(-15, 0, 12);
  cloud.fillCircle(-5, -5, 15);
  cloud.fillCircle(8, 0, 12);
  cloud.fillCircle(15, -3, 10);
  cloud.fillCircle(0, 5, 8);
  
  // Animate cloud movement
  scene.tweens.add({
    targets: cloud,
    x: x + 50,
    duration: 10000,
    repeat: -1,
    yoyo: true,
    ease: 'Sine.easeInOut'
  });
}

function createBubble(scene: Phaser.Scene, x: number, y: number): void {
  const bubble = scene.add.graphics();
  bubble.setPosition(x, y);
  bubble.setAlpha(0.4);
  
  const size = Phaser.Math.Between(3, 8);
  bubble.fillStyle(0x87CEEB);
  bubble.fillCircle(0, 0, size);
  bubble.lineStyle(1, 0xADD8E6);
  bubble.strokeCircle(0, 0, size);
  
  // Animate bubble floating up
  scene.tweens.add({
    targets: bubble,
    y: y - 100,
    alpha: 0,
    duration: 3000,
    repeat: -1,
    delay: Phaser.Math.Between(0, 2000),
    onComplete: () => {
      bubble.y = y;
      bubble.alpha = 0.4;
    }
  });
}