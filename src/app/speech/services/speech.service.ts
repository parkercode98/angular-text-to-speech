import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {} from '@google-cloud/text-to-speech';

// --------------------------------- Types --------------------------------- //
export type GoogleVoiceServiceAudioConfig = {
  /**
   * Range - [0.25, 4.0]
   */
  speakingRate: number;
  /**
   * Range - [-20.0, 20.0]
   */
  pitch: number;
};

export type GoogleVoiceServiceVoiceConfig = {
  languageCode: string;
  name: string;
  ssmlGender: string;
};

export type GoogleVoiceServiceOptions = {
  voice?: GoogleVoiceServiceVoiceConfig;
  audioConfig?: GoogleVoiceServiceAudioConfig;
};

/* ----------------- */
export type TTSPropertyName = keyof Pick<SpeechSynthesisUtterance, 'rate' | 'pitch'>;
export type TTSProperties = { name: TTSPropertyName; value: string };
/* ------------------------------------------------------------------------- */

// -------------------------------------------------------------------------- //
//-                              TEXT TO SPEECH                              -//
// -------------------------------------------------------------------------- //
@Injectable({ providedIn: 'root' })
export class TextToSpeechService {
  /* ----------------- */
  constructor(private http: HttpClient) {
    this.audio = new Audio();
  }

  public audio: HTMLAudioElement;

  /* ----------------- */
  public updateSpeech(property: TTSProperties) {
    const { name, value } = property;
    /* ----------------- */
    localStorage.setItem(name, value);
  }

  public playTextToSpeech(text: string, voiceOptions?: GoogleVoiceServiceVoiceConfig) {
    const speakingRate = +(localStorage.getItem('rate') || '1');
    const pitch = +(localStorage.getItem('pitch') || '1');

    this.getAudio(text, {
      audioConfig: { pitch, speakingRate },
      ...(!!voiceOptions ? { voice: voiceOptions } : {}),
    });
  }

  private getAudio(text: string, options?: GoogleVoiceServiceOptions) {
    const ttsURL = `http://localhost:8080/api/ggl-tts`;

    const request = {
      text,
      ...(options || {}),
    } as const;

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

  public playAudio(data: string) {
    this.audio.src = `data:audio/mp3;base64,${data}`;
    // console.log('Started playing: ' + Date.now());
    this.audio.play().finally(() => {
      // console.log('Ended playing: ' + Date.now());
    });
  }
}
/* -------------------------------------------------------------------------- */

// -------------------------------------------------------------------------- //
//-                              SPEECH TO TEXT                              -//
// -------------------------------------------------------------------------- //
@Injectable({ providedIn: 'root' })
export class SpeechToTextService {
  private mediaRecorder: MediaRecorder = new MediaRecorder(new MediaStream());
  private permissionsGranted: boolean = false;
  private chunks: Blob[] = [];
  public audio: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.askAudioPermissions();
    this.audio = new Audio();
  }

  private askAudioPermissions() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.permissionsGranted = true;
          /* ----------------- */
          this.mediaRecorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
          };

          this.mediaRecorder.onstop = () => {
            console.log('Stopped recording');
            console.log('Chunks:', this.chunks);
            const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
            this.chunks = [];
            console.log('Blob:', blob);
            this.encodeBlob(blob).then((encodedAudio) => this.getTextFromEncodedAudio(encodedAudio));
          };
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
          this.permissionsGranted = false;
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
      this.permissionsGranted = false;
    }
  }

  private encodeBlob(blob: Blob) {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let base64 = reader.result as string;
        base64 = base64.split(',')[1];
        resolve(base64);
      };
      // reader.onloadend = function () {
      //   let base64 = reader.result;
      //   base64 = base64.split(',')[1];
      //   console.log(base64);
      // };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  private getTextFromEncodedAudio(encodedAudio: string | ArrayBuffer | null) {
    // console.log('Encoded audio:');
    // console.log(encodedAudio);

    this.audio.src = `data:audio/mp3;base64,${encodedAudio}`;
    this.audio.play();
    /* ----------------- */
    const sttURL = `http://localhost:8080/api/ggl-stt`;

    const request = {
      audioContent: encodedAudio,
    } as const;

    this.http.post(sttURL, request).subscribe({
      next: (...args: any) => {
        console.log('GCP STT response:', args);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  /* ----------------- */

  public startRecording() {
    if (!this.permissionsGranted) {
      console.error('Permissions not granted!');
      return;
    }

    /* ----------------- */
    this.mediaRecorder.start();
    console.log(this.mediaRecorder.state);
    console.log('recorder started');
  }

  public stopRecording() {
    this.mediaRecorder.stop();
    console.log(this.mediaRecorder.state);
    console.log('recorder stopped');
  }
}
/* -------------------------------------------------------------------------- */
