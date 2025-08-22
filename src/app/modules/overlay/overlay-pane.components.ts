import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { OverlayConfig } from './overlay-config';
import { CommonModule } from '@angular/common';
import { coerceCssValue } from '../../utils/coerceCssValue';
import { Router, RouterModule, NavigationEnd } from '@angular/router';

@Component({
  selector: 'c3-overlay-pane',
  imports: [CommonModule, RouterModule],
  template: `
    @if (hasBackdrop()) {
      <div
        class="overlay-backdrop"
        [ngClass]="backdropClass()"
        (click)="onBackdropClick($event)"
      ></div>
    }

    <div
      #overlayContent
      [ngStyle]="contentStyles()"
      (click)="$event.stopPropagation()"
    ></div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .overlay-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C3OverlayPaneComponent implements OnDestroy {
  public readonly hasBackdrop = input<OverlayConfig['hasBackdrop']>(false);
  public readonly backdropClass = input<OverlayConfig['backdropClass']>('');
  public readonly position = input<OverlayConfig['position']>('center');
  public readonly closeOnOutsideClick =
    input<OverlayConfig['closeOnOutsideClick']>(false);
  public readonly disposeOnNavigation =
    input<OverlayConfig['disposeOnNavigation']>(false);
  public readonly width = input<OverlayConfig['width']>(undefined);
  public readonly height = input<OverlayConfig['height']>(undefined);
  public readonly maxWidth = input<OverlayConfig['maxWidth']>(undefined);
  public readonly maxHeight = input<OverlayConfig['maxHeight']>(undefined);

  public readonly contentReady = output<void>();
  public readonly requestClose = output<void>();

  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);
  private navigationListener: (() => void) | null = null;

  public readonly contentRef = viewChild('overlayContent', {
    read: ElementRef<HTMLDivElement>,
  });

  public readonly contentStyles = computed<Record<string, string>>(() => {
    const style: Record<string, string> = {
      position: 'absolute',
      zIndex: '1000',
      pointerEvents: 'auto',
    };
    const pos = this.position();
    if (typeof pos === 'string') {
      switch (pos) {
        case 'center':
          return {
            ...style,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          };
        case 'top-left':
          return {
            ...style,
            top: '0',
            left: '0',
          };
      }
    }
    if (this.width()) style['width'] = coerceCssValue(this.width());
    if (this.height()) style['height'] = coerceCssValue(this.height());
    return style;
  });

  constructor() {
    effect(() => {
      if (this.contentRef()) this.contentReady.emit();
    });

    effect(() => {
      if (this.disposeOnNavigation()) {
        this.setupNavigationListener();
      } else {
        this.cleanupNavigationListener();
      }
    });

    this._destroyRef.onDestroy(() => this.ngOnDestroy());
  }

  private setupNavigationListener(): void {
    if (this.navigationListener) return;

    const subscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.requestClose.emit();
      }
    });

    this.navigationListener = () => subscription.unsubscribe();
  }

  private cleanupNavigationListener(): void {
    if (this.navigationListener) {
      this.navigationListener();
      this.navigationListener = null;
    }
  }

  public onBackdropClick(event: MouseEvent): void {
    if (this.closeOnOutsideClick()) this.requestClose.emit();
  }

  ngOnDestroy(): void {
    this.cleanupNavigationListener();
  }
}
