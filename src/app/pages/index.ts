// @index(['./*/*component.ts', './*/*/index.{ts,tsx,d.ts}'], f => `export * from '${f.path.replace(/\/index$/, '')}';`)
export * from './home/home.component';
export * from './test/test.component';
// @endindex
