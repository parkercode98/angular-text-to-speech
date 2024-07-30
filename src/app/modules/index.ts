// @index(['./*/*module.ts', './*/*/*module.ts'], f => `export * from '${f.path.replace(/\/index$/, '')}';`)
export * from './event-stream/event-stream.module';
export * from './speech/speech.module';
// @endindex
