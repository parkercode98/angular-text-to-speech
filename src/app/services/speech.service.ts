import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '@env/environment.secret';
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

type RecordOptions = {
  autoStopDetection?: boolean;
};
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
    const GCP_API_KEY = environment.GCP_API_KEY;

    if (!GCP_API_KEY) throw new Error('API_KEY is not defined');

    const ttsURL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GCP_API_KEY}`;

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
    };

    const request = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: 'en-AU-Standard-C',
        ...(options?.voice || {}),
      },
      audioConfig: {
        /**
         * Range - [0.25, 4.0]
         */
        speakingRate: 1.0,
        /**
         * Range - [-20.0, 20.0]
         */
        pitch: 0.0,
        ...(options?.audioConfig || {}),
        audioEncoding: 'MP3',
      },
    } as const;

    this.http.post(ttsURL, request, { headers }).subscribe({
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
  public text$ = new Subject<string>();
  public isRecording$ = new Subject<boolean>();

  public hasAudioPermissions: boolean = false;
  public audioInputDeviceName: string = '';
  /* ----------------- */
  private mediaRecorder: MediaRecorder = new MediaRecorder(new MediaStream());
  private chunks: Blob[] = [];
  private subscription = new Subscription();
  private loudness = {
    current: 1,
    hasSpoken: false,
    _timeoutId: undefined as NodeJS.Timeout | number | undefined,
    shouldStop: false,
    inProgress: false,
  };
  private recordOptions: RecordOptions = {
    autoStopDetection: false,
  };

  constructor(private http: HttpClient) {
    this.init();
  }

  private init() {
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
      this.hasAudioPermissions = result.state === 'granted';
      result.onchange = () => {
        this.hasAudioPermissions = result.state === 'granted';
      };
    });

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const defaultAudioInputDevice = devices.find(
        (device) => device.kind === 'audioinput' && device.deviceId === 'default'
      );
      this.audioInputDeviceName = defaultAudioInputDevice?.label || 'Unknown';
    });

    navigator.mediaDevices.addEventListener('devicechange', this.init.bind(this), { once: true });
  }

  private resetVariables() {
    this.isRecording$.next(false);
    this.chunks = [];
    this.loudness = {
      current: 1,
      hasSpoken: false,
      _timeoutId: undefined,
      shouldStop: false,
      inProgress: false,
    };
    this.recordOptions.autoStopDetection = false;
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }

  private setMediaListeners() {
    this.mediaRecorder.ondataavailable = (event) => {
      console.log('Pushed Chunks');
      this.chunks.push(event.data);
    };

    this.mediaRecorder.onstop = () => {
      const chunks = this.chunks;
      this.resetVariables();
      console.log('Recording stopped');
      const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
      this.encodeBlob(blob).then((encodedAudio) => this.getTextFromEncodedAudio(encodedAudio));
    };

    this.mediaRecorder.onstart = () => {
      this.isRecording$.next(true);
      console.log('Recording started');
      const lousnessLevel$ = watchLoudnessLevel(this.mediaRecorder.stream);

      if (!!this.recordOptions.autoStopDetection) {
        const checkEnd = (fromTO = false) => {
          if (fromTO) this.loudness.inProgress = false;

          if (this.loudness.current < 2) {
            if (this.loudness.hasSpoken) {
              if (fromTO) {
                if (this.loudness.shouldStop) this.stopRecording();
              } else {
                this.loudness.shouldStop = true;
                if (!this.loudness.inProgress) {
                  this.loudness.inProgress = true;
                  this.loudness._timeoutId = setTimeout(checkEnd, 2000, true);
                }
              }
            }
          } else {
            this.loudness.hasSpoken = true;
            this.loudness.shouldStop = false;
            clearTimeout(this.loudness._timeoutId);
          }
        };

        this.subscription.add(
          lousnessLevel$.subscribe((level) => {
            this.loudness.current = level;
            console.log('Level:', level);
            checkEnd();
          })
        );
      }
    };
  }

  private encodeBlob(blob: Blob) {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        let base64 = reader.result as string;
        base64 = base64.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  private playAudio(encodedAudio: string | ArrayBuffer | null) {
    const audio = new Audio();
    audio.src = `data:audio/webm;base64,${encodedAudio}`;
    audio.play();
  }

  private getTextFromEncodedAudio(encodedAudio: string | ArrayBuffer | null) {
    // const audio = new Audio();
    // audio.src = `data:audio/webm;base64,${encodedAudio}`;
    // audio.play();
    /* ----------------- */
    const GCP_API_KEY = environment.GCP_API_KEY;

    if (!GCP_API_KEY) throw new Error('API_KEY is not defined');

    const sttURL = `https://speech.googleapis.com/v1/speech:recognize?key=${GCP_API_KEY}`;

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
    };

    const request = {
      audio: { content: encodedAudio },
      config: {
        encoding: 'WEBM_OPUS',
        languageCode: 'en-US',
      },
    } as const;

    this.http.post(sttURL, request, { headers }).subscribe({
      next: (response: any) => {
        console.group('GCP STT Response');
        console.log(response);
        console.groupEnd();

        const transcription = ((response.results ?? []) as any[])
          .map((result) => result?.alternatives?.[0]?.transcript || '')
          .join('\n');

        this.text$.next(transcription);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });

    // const sttURL = `http://localhost:8080/api/ggl-stt`;

    // this.http.post(sttURL, request).subscribe({
    //   next: (response: any) => {
    //     console.log('GCP STT response:', response);
    //     this.text$.next(response.transcription);
    //   },
    //   error: (error) => {
    //     console.error('Error:', error);
    //   },
    // });
  }

  /* ----------------- */

  public startRecording(options?: RecordOptions) {
    if (!this.hasAudioPermissions || !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      console.error('Permissions not granted!');
      alert('Audio permissions not granted');
      return;
    }

    this.recordOptions = { ...this.recordOptions, ...options };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 128000,
        });

        this.setMediaListeners();

        /* ----------------- */
        this.mediaRecorder.start();
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  }

  public stopRecording() {
    this.mediaRecorder.stop();
  }

  public toggleRecord(options?: RecordOptions) {
    if (this.mediaRecorder.state === 'recording') {
      this.stopRecording();
    } else {
      this.startRecording(options);
    }
  }
}
/* -------------------------------------------------------------------------- */

function watchLoudnessLevel(stream: MediaStream) {
  return new Observable<number>((subscriber) => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let frameId: number;

    const watcher = () => {
      requestAnimationFrame(watcher);

      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }

      const average = sum / bufferLength;

      // // Normalize the average volume to a scale of 1 to 5
      // // 1 - 5
      // const level = Math.min(Math.max(Math.round(average / 51), 1), 5);

      // Normalize the average volume to a scale of 1 to 10
      // 1 - 10
      const level = Math.min(Math.max(Math.round(average / 25.5), 1), 10);

      subscriber.next(level);
    };

    watcher();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      audioCtx.close();
      console.log('Unsubscribed from loudness level');
    };
  });
}
