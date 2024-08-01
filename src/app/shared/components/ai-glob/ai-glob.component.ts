import { ChangeDetectorRef, Component, ElementRef, HostBinding, Input } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
/* -------------------------------------------------------------------------- */

@Component({
  selector: 'ai-glob',
  template: `
    <div class="blobs">
      <svg viewBox="0 0 1200 1200">
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
  host: {
    '[style.--size]': 'getSize()',
    '[style.--scale]': 'getScale()',
  },
})
export class AiGlobComponent {
  private size$ = new BehaviorSubject(0);
  private scale$ = new BehaviorSubject(1);
  private resizeObserver: ResizeObserver | null = null;
  /* ----------------- */

  getSize = toSignal(this.size$.pipe(map((size) => `${size}px`)));
  getScale = toSignal(this.scale$.pipe(map((scale) => scale.toFixed(2))));
  /* ----------------- */

  @HostBinding('style.width.px')
  @Input()
  size: number;

  @Input()
  set scale(scale: number) {
    this.scale$.next(scale);
  }

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.handleResize(this.el.nativeElement.getBoundingClientRect());
    this.resizeObserver = new ResizeObserver((entries) => this.handleResize(entries[0].contentRect));
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
  /* ----------------- */
  private handleResize<T extends ResizeObserverEntry['contentRect']>(contentRect: T) {
    const width = contentRect.width;
    const height = contentRect.height;
    this.size$.next(Math.min(width, height));
  }
}
