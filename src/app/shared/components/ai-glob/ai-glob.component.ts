import { ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
/* -------------------------------------------------------------------------- */

// --------------------------------- Types --------------------------------- //
export namespace AiGlob {
  export type State = 'idle' | 'speaking' | 'listening';
}
/* ------------------------------------------------------------------------- */

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
    '[attr.data-state]': 'getState()',
    '[style.width.px]': 'size',
  },
})
export class AiGlobComponent {
  private size$ = new BehaviorSubject(0);
  private scale$ = new BehaviorSubject(1);
  private state$ = new BehaviorSubject<AiGlob.State>('idle');
  private resizeObserver: ResizeObserver | null = null;
  private subscriptions = new Subscription();
  private intervals = {} as { [key: string | 'scale']: NodeJS.Timeout | undefined };
  /* ----------------- */

  /**
   * Size of the glob in px.
   */
  @Input()
  size: number;

  /**
   * Changes the scale of the glob.
   */
  @Input()
  set scale(scale: number) {
    this.scale$.next(scale);
  }

  /**
   * State of the glob: 'idle' | 'speaking' | 'listening'.
   *
   * @default 'idle'
   */
  @Input()
  set state(state: AiGlob.State) {
    this.state$.next(state);
  }

  /* ----------------- */
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.trackSize();
    this.trackState();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /* ----------------- */
  getSize = toSignal(this.size$.pipe(map((size) => `${size}px`)));

  getScale = toSignal(this.scale$.pipe(map((scale) => scale.toFixed(2))));

  getState = toSignal(this.state$);
  /* ----------------- */

  private trackSize() {
    this.handleResize(this.el.nativeElement.getBoundingClientRect());
    this.resizeObserver = new ResizeObserver((entries) => this.handleResize(entries[0].contentRect));
    this.resizeObserver.observe(this.el.nativeElement);
    this.subscriptions.add(this.resizeObserver.disconnect.bind(this.resizeObserver));
  }

  private trackState() {
    this.subscriptions.add(
      this.state$.subscribe((value) => {
        switch (value) {
          case 'speaking': {
            this.animateScale();
            break;
          }
          case 'listening': {
            break;
          }
          case 'idle': {
            this.animateScale(false);
            break;
          }
        }
      })
    );
    this.subscriptions.add(() => {
      this.animateScale(false);
    });
  }

  private handleResize<T extends ResizeObserverEntry['contentRect']>(contentRect: T) {
    this.size$.next(Math.min(contentRect.width, contentRect.height));
  }

  // ------------- Animation ------------- //
  private animateScale(animate = true) {
    if (!animate) {
      this.intervals.scale && clearInterval(this.intervals.scale);
      this.scale$.next(1);
      return;
    }

    this.intervals.scale = setInterval(() => {
      const dec = Math.random() * (1.2 - 0.8) + 0.8;
      this.scale$.next(dec);
    }, 150);
  }
}

/* -------------------------------------------------------------------------- */
