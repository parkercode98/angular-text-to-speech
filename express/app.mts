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

// ------------------------------- Eleven Labs ------------------------------- //
app.post('/api/elbs-tts', async (req, res) => {
  try {
    const ELEVEN_LABS_API_KEY = process.env['ELEVEN_LABS_API_KEY'];
    const ELEVEN_LABS_VOICE_ID = process.env['ELEVEN_LABS_VOICE_ID'] || '21m00Tcm4TlvDq8ikWAM';

    if (!ELEVEN_LABS_API_KEY) throw new Error('API_KEY is not defined');

    const text = req.body?.text;
    if (!text) throw new Error('Text is not defined');

    const ttsURL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`;

    const headers = {
      accept: 'audio/mpeg',
      'content-type': 'application/json',
      'xi-api-key': ELEVEN_LABS_API_KEY,
    };

    const request = {
      text,
      model_id: 'eleven_multilingual_v2',
      ...(req.body || {}),
      voice_settings: {
        //defaults specific to voiceId
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true,
        ...(req.body?.voice_settings || {}),
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

// ------------------------------- Google Tts ------------------------------- //
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
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
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

// ---------------------------------- Start --------------------------------- //
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
