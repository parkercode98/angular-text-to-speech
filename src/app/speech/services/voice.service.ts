import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * @usage
 *
 * ```ts
 * import { VoiceService } from './voice.service';
 *
 * export class Component {
 *   constructor(private audio: AudioService) {}
 *
 *   public playTextToSpeech(text: string) {
 *     this.audio.playTextToSpeech(text);
 *   }
 *
 *   public playStreamAudio(text: string) {
 *     this.audio.playStreamAudio(text);
 *   }
 *
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ElevenLabsVoiceService {
  public audio: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.audio = new Audio();
  }

  public setAudioSourceAndPlay(source: string): void {
    this.audio.src = source;
    this.audio.play();
  }

  public setAudioAndPlay(data: ArrayBuffer): void {
    const blob = new Blob([data], { type: 'audio/mpeg' });
    console.log('Blob:', blob);
    const url = URL.createObjectURL(blob);
    console.log('URL:', url);
    this.audio.src = url;
    console.log('Started playing: ' + Date.now());
    this.audio.play();
    console.log('Ended playing: ' + Date.now());
  }

  public playTextToSpeech(text: string) {
    this.getAudio(text);
  }

  private getAudio(text: string) {
    const ttsURL = `http://localhost:8080/api/elbs-tts`;

    const request = {
      text,
    } as const;

    console.log('Call made: ' + Date.now());
    this.http.post(ttsURL, request).subscribe({
      next: (response: any) => {
        console.log('ElevenLabs response:', response);
        // this.playAudio(response);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  private playAudio(data: ArrayBuffer) {
    this.setAudioAndPlay(data);
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleVoiceService {
  public audio: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.audio = new Audio();
  }

  public playTextToSpeech(text: string) {
    this.getAudio(text);
  }

  private getAudio(text: string) {
    const ttsURL = `http://localhost:8080/api/ggl-tts`;

    const request = {
      text,
    } as const;

    console.log('Call to GCP TTS made: ' + Date.now());

    this.http.post(ttsURL, request).subscribe({
      next: (response: any) => {
        console.log('GCP TTS response:', response);
        this.playAudio(response.audioContent);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  private playAudio(data: string) {
    this.setAudioAndPlay(data);
  }

  public setAudioAndPlay(data: string): void {
    this.audio.src = `data:audio/mp3;base64,${data}`;
    console.log('Started playing: ' + Date.now());
    this.audio.play().finally(() => {
      console.log('Ended playing: ' + Date.now());
    });
  }
}
