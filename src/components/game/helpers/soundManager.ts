import { JsfxrResource, type SoundConfig } from '@excaliburjs/plugin-jsfxr';

// Sound configurations for different game actions
const soundsConfig: Record<string, SoundConfig> = {
  playerShoot: {
    oldParams: true,
    wave_type: 1,
    p_env_attack: 0,
    p_env_sustain: 0.1,
    p_env_punch: 0.3,
    p_env_decay: 0.2,
    p_base_freq: 0.6,
    p_freq_limit: 0,
    p_freq_ramp: -0.3,
    p_freq_dramp: 0,
    p_vib_strength: 0,
    p_vib_speed: 0,
    p_arp_mod: 0,
    p_arp_speed: 0,
    p_duty: 0,
    p_duty_ramp: 0,
    p_repeat_speed: 0,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0,
    p_lpf_resonance: 0,
    p_hpf_freq: 0,
    p_hpf_ramp: 0,
    sound_vol: 0.25,
    sample_rate: 44100,
    sample_size: 16
  },
  enemyShoot: {
    oldParams: true,
    wave_type: 2,
    p_env_attack: 0,
    p_env_sustain: 0.2,
    p_env_punch: 0.1,
    p_env_decay: 0.3,
    p_base_freq: 0.3,
    p_freq_limit: 0,
    p_freq_ramp: 0.2,
    p_freq_dramp: 0,
    p_vib_strength: 0,
    p_vib_speed: 0,
    p_arp_mod: 0,
    p_arp_speed: 0,
    p_duty: 0.5,
    p_duty_ramp: 0,
    p_repeat_speed: 0,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0,
    p_lpf_resonance: 0,
    p_hpf_freq: 0,
    p_hpf_ramp: 0,
    sound_vol: 0.2,
    sample_rate: 44100,
    sample_size: 16
  },
  powerUp: {
    oldParams: true,
    wave_type: 0,
    p_env_attack: 0,
    p_env_sustain: 0.3,
    p_env_punch: 0.5,
    p_env_decay: 0.4,
    p_base_freq: 0.8,
    p_freq_limit: 0,
    p_freq_ramp: 0.3,
    p_freq_dramp: 0,
    p_vib_strength: 0.2,
    p_vib_speed: 0.1,
    p_arp_mod: 0.5,
    p_arp_speed: 0.3,
    p_duty: 0,
    p_duty_ramp: 0,
    p_repeat_speed: 0,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0,
    p_lpf_resonance: 0,
    p_hpf_freq: 0,
    p_hpf_ramp: 0,
    sound_vol: 0.3,
    sample_rate: 44100,
    sample_size: 16
  },
  playerHit: {
    oldParams: true,
    wave_type: 3,
    p_env_attack: 0,
    p_env_sustain: 0.1,
    p_env_punch: 0.1,
    p_env_decay: 0.6,
    p_base_freq: 0.2,
    p_freq_limit: 0,
    p_freq_ramp: -0.5,
    p_freq_dramp: 0,
    p_vib_strength: 0,
    p_vib_speed: 0,
    p_arp_mod: 0,
    p_arp_speed: 0,
    p_duty: 0,
    p_duty_ramp: 0,
    p_repeat_speed: 0,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0,
    p_lpf_resonance: 0,
    p_hpf_freq: 0,
    p_hpf_ramp: 0,
    sound_vol: 0.4,
    sample_rate: 44100,
    sample_size: 16
  }
};

class SoundManager {
  private plugin: JsfxrResource | null = null;
  private isInitialized: boolean = false;
  private backgroundMusic: HTMLAudioElement | null = null;
  private musicLoaded: boolean = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      this.plugin = new JsfxrResource();
      await this.plugin.init();
      for (const name in soundsConfig) {
        this.plugin.loadSoundConfig(name, soundsConfig[name]);
      }
      this.isInitialized = true;
      console.log('🎵 Sound system initialized successfully!');
      
      // Initialize background music
      await this.initBackgroundMusic();
    } catch (error) {
      console.warn('Failed to initialize sound manager:', error);
    }
  }

  private async initBackgroundMusic(): Promise<void> {
    try {
      this.backgroundMusic = new Audio('https://h44wh35vnve37gr7x7n7w6m5fdsm5h7f3swr3ucr6s6kidtjuniq.arweave.net/Pzlj77VtSb-aP7_b-3mdKOTOn-XcrR3QUfS8pA5po1E');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3; // Set to 30% volume
      this.backgroundMusic.preload = 'auto';
      
      // Wait for the audio to be ready
      await new Promise<void>((resolve) => {
        const onCanPlay = (): void => {
          this.musicLoaded = true;
          this.backgroundMusic!.removeEventListener('canplaythrough', onCanPlay);
          console.log('🎶 Background music loaded successfully!');
          resolve();
        };
        
        if (this.backgroundMusic!.readyState >= 3) {
          onCanPlay();
        } else {
          this.backgroundMusic!.addEventListener('canplaythrough', onCanPlay);
        }
      });
    } catch (error) {
      console.warn('Failed to load background music:', error);
    }
  }

  playSound(soundName: string): void {
    if (!this.plugin || !this.isInitialized) return;
    try {
      this.plugin.playSound(soundName);
    } catch (error) {
      console.warn(`Failed to play sound "${soundName}":`, error);
    }
  }

  playPlayerShoot(): void { 
    this.playSound('playerShoot'); 
  }
  
  playEnemyShoot(): void { 
    this.playSound('enemyShoot'); 
  }
  
  playPowerUp(): void { 
    this.playSound('powerUp'); 
  }
  
  playPlayerHit(): void { 
    this.playSound('playerHit'); 
  }

  async playBackgroundMusic(): Promise<void> {
    if (!this.backgroundMusic || !this.musicLoaded) {
      console.warn('Background music not ready yet');
      return;
    }
    
    try {
      await this.backgroundMusic.play();
      console.log('🎵 Background music started!');
    } catch (error) {
      console.warn('Failed to play background music (user interaction may be required):', error);
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