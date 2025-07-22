import * as Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

const gameConfig: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 500,
  type: Phaser.AUTO,
  backgroundColor: '#87CEEB', // Sky blue background
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0.8 },
      debug: false, // Set to true for debugging physics bodies
      enableSleeping: false,
    }
  },
  plugins: {
    scene: [
      { 
        plugin: PhaserMatterCollisionPlugin, 
        key: 'matterCollision', 
        mapping: 'matterCollision' 
      }
    ]
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 500,
  },
  fps: { 
    target: 60, 
    forceSetTimeOut: true 
  },
  input: {
    gamepad: true,
    mouse: true,
    touch: true,
    keyboard: true
  }
};

export default gameConfig;