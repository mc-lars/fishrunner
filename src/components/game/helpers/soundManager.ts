type SoundMap = Record<string, HTMLAudioElement>;

const soundURLs: Record<string, string> = {
  playerShoot: '/sounds/playerShoot.mp3',
  enemyShoot: '/sounds/enemyShoot.mp3',
  powerUp: '/sounds/powerUp.mp3',
  playerHit: '/sounds/playerHit.mp3',
};

class SoundManager {
  private sounds: SoundMap = {};
  private isInitialized = false;
  private backgroundMusic: HTMLAudioElement | null = null;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      for (const [name, url] of Object.entries(soundURLs)) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds[name] = audio;
      }

      this.backgroundMusic = new Audio('https://h44wh35vnve37gr7x7n7w6m5fdsm5h7f3swr3ucr6s6kidtjuniq.arweave.net/Pzlj77VtSb-aP7_b-3mdKOTOn-XcrR3QUfS8pA5po1E');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3;

      this.isInitialized = true;
      console.log('🎵 Sound system initialized!');
    } catch (err) {
      console.warn('SoundManager failed to initialize:', err);
    }
  }

  playSound(name: string): void {
    const sound = this.sounds[name];
    if (!sound) return;

    const clone = sound.cloneNode(true) as HTMLAudioElement;
    clone.volume = sound.volume;
    clone.play().catch(err => {
      console.warn(`Failed to play sound "${name}":`, err);
    });
  }

  playPlayerShoot() {
    this.playSound('playerShoot');
  }

  playEnemyShoot() {
    this.playSound('enemyShoot');
  }

  playPowerUp() {
    this.playSound('powerUp');
  }

  playPlayerHit() {
    this.playSound('playerHit');
  }

  async playBackgroundMusic(): Promise<void> {
    if (!this.backgroundMusic) return;

    try {
      await this.backgroundMusic.play();
      console.log('🎶 Background music playing');
    } catch (err) {
      console.warn('Background music could not play:', err);
    }
  }

  pauseBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  setMusicVolume(volume: number): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
    }
  }

  isMusicPlaying(): boolean {
    return this.backgroundMusic ? !this.backgroundMusic.paused : false;
  }
}

export const soundManager = new SoundManager();
