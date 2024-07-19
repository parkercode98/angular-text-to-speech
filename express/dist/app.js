"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// express/app.mts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_express = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);
var envPath = import_path.default.resolve(__dirname, "../../.env.local");
import_dotenv.default.config({
  path: envPath,
  debug: true,
  encoding: "utf8",
  override: true,
  processEnv: process.env
});
var PORT = 8080;
var app = (0, import_express.default)();
app.use((0, import_cors.default)());
app.use(import_express.default.json());
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!" });
});
app.post("/api/elbs-tts", async (req, res) => {
  try {
    const ELEVEN_LABS_API_KEY = process.env["ELEVEN_LABS_API_KEY"];
    const ELEVEN_LABS_VOICE_ID = process.env["ELEVEN_LABS_VOICE_ID"] || "21m00Tcm4TlvDq8ikWAM";
    if (!ELEVEN_LABS_API_KEY) throw new Error("API_KEY is not defined");
    const text = req.body?.text;
    if (!text) throw new Error("Text is not defined");
    const ttsURL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`;
    const headers = {
      accept: "audio/mpeg",
      "content-type": "application/json",
      "xi-api-key": ELEVEN_LABS_API_KEY
    };
    const request = {
      text,
      model_id: "eleven_multilingual_v2",
      ...req.body || {},
      voice_settings: {
        //defaults specific to voiceId
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true,
        ...req.body?.voice_settings || {}
      }
    };
    const response = await fetch(ttsURL, {
      method: "POST",
      headers,
      body: JSON.stringify(request)
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
app.post("/api/ggl-tts", async (req, res) => {
  try {
    const GCP_API_KEY = process.env["GCP_API_KEY"];
    if (!GCP_API_KEY) throw new Error("API_KEY is not defined");
    const text = req.body?.text;
    if (!text) throw new Error("Text is not defined");
    const ttsURL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GCP_API_KEY}`;
    const headers = {
      accept: "application/json",
      "content-type": "application/json"
    };
    const request = {
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" }
    };
    const response = await fetch(ttsURL, {
      method: "POST",
      headers,
      body: JSON.stringify(request)
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
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
