import * as Phaser from 'phaser';
import { addText, updateText } from './helpers/phaserHelpers';
import { setupKeyboardControls, setupMobileControls, updatePlayerMovement } from './helpers/inputHelpers';
import { soundManager } from './helpers/soundManager';
import { createFish, createHamster, updateFish, updateHamster, createStar } from './helpers/gameEntities';
import { createPlatforms, createBoundaries, createBackgroundElements } from './helpers/levelHelpers';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private hamster!: Phaser.GameObjects.Sprite;
  private platforms!: Phaser.GameObjects.Group;
  private stars!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key, A: Phaser.Input.Keyboard.Key, S: Phaser.Input.Keyboard.Key, D: Phaser.Input.Keyboard.Key };
  
  private score: number = 0;
  private gameStartTime: number = 0;
  private lastHamsterDirection: number = 1;
  private hamsterSpeed: number = 1.5;
  
  // Mobile controls
  private leftButton!: Phaser.GameObjects.Graphics;
  private rightButton!: Phaser.GameObjects.Graphics;
  private jumpButton!: Phaser.GameObjects.Graphics;
  private isMobile: boolean = false;
  
  // Input states
  private inputStates: {
    left: boolean;
    right: boolean;
    jump: boolean;
  } = { left: false, right: false, jump: false };

  constructor() { 
    super('GameScene'); 
  }

  preload(): void {
    // Load custom fish and hamster images
    this.load.image('fish', 'https://static.vecteezy.com/system/resources/previews/048/718/642/non_2x/fish-on-transparent-background-free-png.png');
    this.load.image('hamster', 'https://static.vecteezy.com/system/resources/previews/026/748/793/non_2x/cute-little-hamster-png.png');
  }

  create(): void {
    this.gameStartTime = Date.now();
    this.isMobile = window.innerWidth < 768;
    
    // Initialize sound system
    soundManager.init();
    
    // Create level geometry and background
    createBackgroundElements(this);
    createBoundaries(this);
    this.platforms = createPlatforms(this);
    
    // Create game entities
    this.player = createFish(this, 100, 300);
    this.hamster = createHamster(this, 700, 300);
    
    // Create collectible stars
    this.stars = this.add.group();
    this.createInitialStars();
    
    // Setup input controls
    this.setupInputControls();
    
    // Create UI elements
    this.createUI();
    
    // Setup collision detection
    this.setupCollisions();
  }

  private createInitialStars(): void {
    const starPositions: Array<{x: number, y: number}> = [
      { x: 200, y: 200 },
      { x: 400, y: 150 },
      { x: 600, y: 250 },
      { x: 150, y: 100 },
      { x: 650, y: 100 },
    ];
    
    starPositions.forEach(pos => {
      const star = createStar(this, pos.x, pos.y);
      this.stars.add(star);
    });
  }

  private setupInputControls(): void {
    // Keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys('W,A,S,D') as any;
    
    // Mobile controls
    if (this.isMobile) {
      setupMobileControls(this, (direction: string, pressed: boolean) => {
        if (direction === 'left') this.inputStates.left = pressed;
        if (direction === 'right') this.inputStates.right = pressed;
        if (direction === 'jump') this.inputStates.jump = pressed;
      });
    }
  }

  private createUI(): void {
    // Score display
    addText(this, 'score', 20, 20, 'Score: 0', { 
      fontSize: '24px', 
      color: '#fff',
      stroke: '#000',
      strokeThickness: 2
    });
    
    // Stats monitor (top-right corner)
    if (!this.isMobile) {
      addText(this, 'stats', this.cameras.main.width - 200, 20, '', { 
        fontSize: '14px', 
        color: '#fff',
        backgroundColor: '#000000aa',
        padding: { x: 10, y: 5 }
      });
      
      // Control instructions (top-middle)
      addText(this, 'controls', this.cameras.main.width / 2, 20, 'Arrow Keys / WASD to move • Space/Up to jump', {
        fontSize: '16px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 2,
        align: 'center'
      });
    } else {
      // Mobile instructions
      addText(this, 'controls', this.cameras.main.width / 2, 40, 'Use touch controls below!', {
        fontSize: '18px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 2,
        align: 'center'
      });
    }
  }

  private setupCollisions(): void {
    // Star collection collision
    this.matter.world.on('beforeupdate', () => {
      this.stars.children.entries.forEach((star: any) => {
        const distance = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          star.x, star.y
        );
        
        if (distance < 40) {
          this.collectStar(star);
        }
      });
      
      // Hamster catching fish collision
      const hamsterDistance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.hamster.x, this.hamster.y
      );
      
      if (hamsterDistance < 50) {
        this.hamsterCatchesFish();
      }
    });
  }

  private collectStar(star: Phaser.GameObjects.Graphics): void {
    star.destroy();
    this.score += 100;
    soundManager.playPowerUp();
    updateText('score', `Score: ${this.score}`);
    
    // Spawn new star at random location
    const newX = Phaser.Math.Between(50, 750);
    const newY = Phaser.Math.Between(50, 200);
    const newStar = createStar(this, newX, newY);
    this.stars.add(newStar);
  }

  private hamsterCatchesFish(): void {
    soundManager.playPlayerHit();
    this.score = Math.max(0, this.score - 50);
    updateText('score', `Score: ${this.score}`);
    
    // Reset fish position to safe location
    this.matter.body.setPosition(this.player.body as MatterJS.BodyType, { x: 100, y: 200 });
    this.matter.body.setVelocity(this.player.body as MatterJS.BodyType, { x: 0, y: 0 });
  }

  update(): void {
    // Update player movement
    updatePlayerMovement(this, this.player, this.cursors, this.wasdKeys, this.inputStates);
    
    // Update fish animation
    updateFish(this.player);
    
    // Update hamster AI
    this.updateHamsterAI();
    updateHamster(this.hamster);
    
    // Update UI stats
    this.updateStats();
  }

  private updateHamsterAI(): void {
    const hamsterBody = this.hamster.body as MatterJS.BodyType;
    const playerX = this.player.x;
    const hamsterX = this.hamster.x;
    
    // Simple AI: hamster chases the fish
    const direction = playerX > hamsterX ? 1 : -1;
    
    // Change direction smoothly
    if (direction !== this.lastHamsterDirection) {
      this.lastHamsterDirection = direction;
    }
    
    // Apply horizontal movement
    const currentVelocity = hamsterBody.velocity;
    const targetVelocityX = direction * this.hamsterSpeed;
    
    this.matter.body.setVelocity(hamsterBody, {
      x: targetVelocityX,
      y: currentVelocity.y
    });
    
    // Hamster jumps if fish is above and close
    const verticalDistance = this.player.y - this.hamster.y;
    const horizontalDistance = Math.abs(playerX - hamsterX);
    
    if (verticalDistance < -30 && horizontalDistance < 100 && Math.abs(currentVelocity.y) < 1) {
      this.matter.body.applyForce(hamsterBody, hamsterBody.position, { x: 0, y: -0.02 });
      soundManager.playEnemyShoot();
    }
  }

  private updateStats(): void {
    if (!this.isMobile) {
      const currentTime = Date.now();
      const gameTime = Math.floor((currentTime - this.gameStartTime) / 1000);
      const fps = Math.round(this.game.loop.actualFps);
      
      const statsText = 
        `FPS: ${fps}
Mobile: ${this.isMobile}
Fish: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})
Score: ${this.score}
Time: ${gameTime}s`;
      
      updateText('stats', statsText);
    }
  }
}

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      matterCollision: any;
    }
  }
}