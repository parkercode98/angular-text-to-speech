// -------------------------------------------------------------------------- //
//-                                EXPRESS APP                               -//
// -------------------------------------------------------------------------- //

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
// ------------------------------- Load Env ------------------------------- //

const envPath = path.resolve(__dirname, '../../.env.local');

dotenv.config({
  path: envPath,
  debug: true,
  encoding: 'utf8',
  override: true,
  processEnv: process.env as any,
});

/* -------------------------------------------------------------------------- */

// ------------------------------- Constants ------------------------------- //
const PORT = 8080;
/* ------------------------------------------------------------------------- */

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// ------------------------------- Google TTS ------------------------------- //
app.post('/api/ggl-tts', async (req, res) => {
  try {
    const GCP_API_KEY = process.env['GCP_API_KEY'];

    if (!GCP_API_KEY) throw new Error('API_KEY is not defined');

    const text = req.body?.text;
    if (!text) throw new Error('Text is not defined');

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
        ...(req.body?.voice || {}),
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
        ...(req.body?.audioConfig || {}),
        audioEncoding: 'MP3',
      },
    } as const;

    const response = await fetch(ttsURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Error: ${error}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/ggl-stt', async (req, res) => {
  try {
    const GCP_API_KEY = process.env['GCP_API_KEY'];

    if (!GCP_API_KEY) throw new Error('API_KEY is not defined');

    const audioContent = req.body?.audioContent;
    if (!audioContent) throw new Error('audioContent is not defined');

    const sttURL = `https://speech.googleapis.com/v1/speech:recognize?key=${GCP_API_KEY}`;

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
    };

    const request = {
      audio: { content: audioContent },
      config: {
        encoding: 'FLAC',
        languageCode: 'en-US',
      },
    } as const;

    const response = await fetch(sttURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Error: ${error}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

// ---------------------------------- Start --------------------------------- //
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
