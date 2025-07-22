import * as Phaser from 'phaser';
import { soundManager } from './soundManager';

export interface InputStates {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export function setupKeyboardControls(
  scene: Phaser.Scene, 
  callback: (key: string, pressed: boolean) => void
): void {
  const cursors = scene.input.keyboard!.createCursorKeys();
  const wasdKeys = scene.input.keyboard!.addKeys('W,A,S,D,SPACE') as any;
  
  // Arrow keys and WASD
  cursors.left.on('down', () => callback('left', true));
  cursors.left.on('up', () => callback('left', false));
  cursors.right.on('down', () => callback('right', true));
  cursors.right.on('up', () => callback('right', false));
  cursors.up.on('down', () => callback('jump', true));
  cursors.up.on('up', () => callback('jump', false));
  
  wasdKeys.A.on('down', () => callback('left', true));
  wasdKeys.A.on('up', () => callback('left', false));
  wasdKeys.D.on('down', () => callback('right', true));
  wasdKeys.D.on('up', () => callback('right', false));
  wasdKeys.W.on('down', () => callback('jump', true));
  wasdKeys.W.on('up', () => callback('jump', false));
  wasdKeys.SPACE.on('down', () => callback('jump', true));
  wasdKeys.SPACE.on('up', () => callback('jump', false));
}

export function setupMobileControls(
  scene: Phaser.Scene,
  callback: (direction: string, pressed: boolean) => void
): void {
  const buttonSize = 60;
  const buttonY = scene.cameras.main.height - 80;
  const buttonAlpha = 0.6;
  
  // Left button
  const leftButton = scene.add.graphics();
  leftButton.setPosition(50, buttonY);
  leftButton.fillStyle(0x4CAF50, buttonAlpha);
  leftButton.fillCircle(0, 0, buttonSize / 2);
  leftButton.setInteractive(new Phaser.Geom.Circle(0, 0, buttonSize / 2), Phaser.Geom.Circle.Contains);
  leftButton.setScrollFactor(0);
  leftButton.setDepth(100);
  
  // Draw arrow
  leftButton.lineStyle(4, 0xffffff);
  leftButton.beginPath();
  leftButton.moveTo(-10, -10);
  leftButton.lineTo(-20, 0);
  leftButton.lineTo(-10, 10);
  leftButton.strokePath();
  
  // Right button
  const rightButton = scene.add.graphics();
  rightButton.setPosition(130, buttonY);
  rightButton.fillStyle(0x4CAF50, buttonAlpha);
  rightButton.fillCircle(0, 0, buttonSize / 2);
  rightButton.setInteractive(new Phaser.Geom.Circle(0, 0, buttonSize / 2), Phaser.Geom.Circle.Contains);
  rightButton.setScrollFactor(0);
  rightButton.setDepth(100);
  
  // Draw arrow
  rightButton.lineStyle(4, 0xffffff);
  rightButton.beginPath();
  rightButton.moveTo(10, -10);
  rightButton.lineTo(20, 0);
  rightButton.lineTo(10, 10);
  rightButton.strokePath();
  
  // Jump button
  const jumpButton = scene.add.graphics();
  jumpButton.setPosition(scene.cameras.main.width - 80, buttonY);
  jumpButton.fillStyle(0xFF5722, buttonAlpha);
  jumpButton.fillCircle(0, 0, buttonSize / 2);
  jumpButton.setInteractive(new Phaser.Geom.Circle(0, 0, buttonSize / 2), Phaser.Geom.Circle.Contains);
  jumpButton.setScrollFactor(0);
  jumpButton.setDepth(100);
  
  // Draw up arrow
  jumpButton.lineStyle(4, 0xffffff);
  jumpButton.beginPath();
  jumpButton.moveTo(-10, 5);
  jumpButton.lineTo(0, -10);
  jumpButton.lineTo(10, 5);
  jumpButton.strokePath();
  
  // Add event listeners
  leftButton.on('pointerdown', () => callback('left', true));
  leftButton.on('pointerup', () => callback('left', false));
  leftButton.on('pointerout', () => callback('left', false));
  
  rightButton.on('pointerdown', () => callback('right', true));
  rightButton.on('pointerup', () => callback('right', false));
  rightButton.on('pointerout', () => callback('right', false));
  
  jumpButton.on('pointerdown', () => callback('jump', true));
  jumpButton.on('pointerup', () => callback('jump', false));
  jumpButton.on('pointerout', () => callback('jump', false));
}

export function updatePlayerMovement(
  scene: Phaser.Scene,
  player: Phaser.GameObjects.Graphics,
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  wasdKeys: any,
  inputStates: InputStates
): void {
  const playerBody = player.body as MatterJS.BodyType;
  const speed = 0.01;
  const jumpForce = -0.03;
  const maxVelocityX = 5;
  
  // Check if player is on ground (low vertical velocity)
  const isOnGround = Math.abs(playerBody.velocity.y) < 1;
  
  // Horizontal movement
  const isLeftPressed = cursors.left.isDown || wasdKeys.A?.isDown || inputStates.left;
  const isRightPressed = cursors.right.isDown || wasdKeys.D?.isDown || inputStates.right;
  const isJumpPressed = cursors.up.isDown || wasdKeys.W?.isDown || wasdKeys.SPACE?.isDown || inputStates.jump;
  
  if (isLeftPressed && !isRightPressed) {
    scene.matter.body.applyForce(playerBody, playerBody.position, { x: -speed, y: 0 });
  } else if (isRightPressed && !isLeftPressed) {
    scene.matter.body.applyForce(playerBody, playerBody.position, { x: speed, y: 0 });
  }
  
  // Limit horizontal velocity
  if (playerBody.velocity.x > maxVelocityX) {
    scene.matter.body.setVelocity(playerBody, { x: maxVelocityX, y: playerBody.velocity.y });
  } else if (playerBody.velocity.x < -maxVelocityX) {
    scene.matter.body.setVelocity(playerBody, { x: -maxVelocityX, y: playerBody.velocity.y });
  }
  
  // Jumping
  if (isJumpPressed && isOnGround) {
    scene.matter.body.applyForce(playerBody, playerBody.position, { x: 0, y: jumpForce });
    soundManager.playPlayerShoot();
  }
  
  // Add air resistance
  scene.matter.body.setVelocity(playerBody, { 
    x: playerBody.velocity.x * 0.95, 
    y: playerBody.velocity.y 
  });
}