'use client';
import React, { useEffect, useRef } from 'react';
import gameConfig from './gameConfig';
import GameScene from './GameScene';
import * as Phaser from 'phaser';

let game: Phaser.Game | null = null;

const PhaserGameComponent: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!game && typeof window !== 'undefined' && gameContainerRef.current) {
      // Clone config, set scene
      const config: Phaser.Types.Core.GameConfig = {
        ...gameConfig,
        scene: GameScene,
        parent: gameContainerRef.current,
      };
      game = new Phaser.Game(config);
    }
    
    return () => {
      if (game) {
        game.destroy(true);
        game = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <div ref={gameContainerRef} className="w-full min-h-[500px] rounded-lg overflow-hidden" />
    </div>
  );
};

export default PhaserGameComponent;