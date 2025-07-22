class SoundManager {
  private backgroundMusic: HTMLAudioElement | null = null;
  private musicLoaded = false;

  async init(): Promise<void> {
    if (this.backgroundMusic) return;

    try {
      this.backgroundMusic = new Audio('https://h44wh35vnve37gr7x7n7w6m5fdsm5h7f3swr3ucr6s6kidtjuniq.arweave.net/Pzlj77VtSb-aP7_b-3mdKOTOn-XcrR3QUfS8pA5po1E');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3;
      this.backgroundMusic.preload = 'auto';

      await new Promise<void>((resolve) => {
        const onReady = () => {
          this.musicLoaded = true;
          this.backgroundMusic!.removeEventListener('canplaythrough', onReady);
          console.log('🎶 Background music loaded');
          resolve();
        };

        if (this.backgroundMusic.readyState >= 3) {
          onReady();
        } else {
          this.backgroundMusic.addEventListener('canplaythrough', onReady);
        }
      });
    } catch (err) {
      console.warn('Failed to initialize background music:', err);
    }
  }

  async playBackgroundMusic(): Promise<void> {
    if (!this.backgroundMusic || !this.musicLoaded) return;

    try {
      await this.backgroundMusic.play();
      console.log('🎵 Background music playing');
    } catch (err) {
      console.warn('Playback failed:', err);
    }
  }

  pauseBackgroundMusic(): void {
    this.backgroundMusic?.pause();
  }

  setMusicVolume(volume: number): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
    }
  }

  isMusicPlaying(): boolean {
    return !!this.backgroundMusic && !this.backgroundMusic.paused;
  }
}

export const soundManager = new SoundManager();
