import { Component } from '@angular/core';

// @Component({
//   selector: 'ai-glob',
//   template: `
//     <svg viewbox="0 0 1200 1200">
//       <g class="blob blob-1">
//         <path />
//       </g>
//       <g class="blob blob-2">
//         <path />
//       </g>
//       <g class="blob blob-3">
//         <path />
//       </g>
//       <g class="blob blob-4">
//         <path />
//       </g>
//       <g class="blob blob-1 alt">
//         <path />
//       </g>
//       <g class="blob blob-2 alt">
//         <path />
//       </g>
//       <g class="blob blob-3 alt">
//         <path />
//       </g>
//       <g class="blob blob-4 alt">
//         <path />
//       </g>
//     </svg>
//   `,
//   styleUrl: './ai-glob.component.scss',
// })
// export class AiGlobComponent {}
@Component({
  selector: 'ai-glob',
  template: `
    <div class="blobs">
      <svg viewbox="0 0 1200 1200" width="100%" height="100%">
        <g class="blob blob-1">
          <path />
        </g>
        <g class="blob blob-2">
          <path />
        </g>
        <g class="blob blob-3">
          <path />
        </g>
        <g class="blob blob-4">
          <path />
        </g>
        <g class="blob blob-1 alt">
          <path />
        </g>
        <g class="blob blob-2 alt">
          <path />
        </g>
        <g class="blob blob-3 alt">
          <path />
        </g>
        <g class="blob blob-4 alt">
          <path />
        </g>
      </svg>
    </div>
  `,
  styleUrl: './ai-glob.component.scss',
})
export class AiGlobComponent {}
