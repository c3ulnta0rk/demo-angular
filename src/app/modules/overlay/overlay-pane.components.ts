import { Component, computed, DestroyRef, effect, ElementRef, inject, Injector, input, Input, output, viewChild } from '@angular/core';
import { OverlayConfig } from './overlay-config';
import { CommonModule } from '@angular/common';
import { coerceCssValue } from '../../utils/coerceCssValue';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'c3-overlay-pane',
    imports: [CommonModule, RouterModule],
    template: `
    @if (hasBackdrop()){
      <div
        class="overlay-backdrop"
        [ngClass]="backdropClass()"
        (click)="onBackdropClick($event)">
      </div>
    }
    
    <div class="overlay-content" #overlayContent [ngStyle]="contentStyles()"></div>
  `,
    styles: [`
    :host {
      /* L’hôte est en position absolue (ou fixed) dans le container overlay principal */
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; /* Permet de gérer l’empilement, 
                               on va activer pointer-events seulement sur le backdrop ou le contenu */
    }

    .overlay-backdrop {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: auto; /* On veut capter le clic */
    }

    .overlay-content {
      pointer-events: auto; /* autorise l'interaction avec le contenu */
    }
  `]
})
export class C3OverlayPaneComponent {
  public readonly hasBackdrop = input<OverlayConfig['hasBackdrop']>(false); 
  public readonly backdropClass = input<OverlayConfig['backdropClass']>('');
  public readonly position = input<OverlayConfig['position']>('center');
  public readonly closeOnOutsideClick = input<OverlayConfig['closeOnOutsideClick']>(false);
  public readonly disposeOnNavigation = input<OverlayConfig['disposeOnNavigation']>(false);
  public readonly width = input<OverlayConfig['width']>(undefined);
  public readonly height = input<OverlayConfig['height']>(undefined);
  public readonly maxWidth = input<OverlayConfig['maxWidth']>(undefined);
  public readonly maxHeight = input<OverlayConfig['maxHeight']>(undefined);

  public readonly contentReady = output<void>();
  public readonly requestClose = output<void>();

  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  public readonly contentRef = viewChild('overlayContent', { read: ElementRef<HTMLDivElement> });

  public readonly contentStyles = computed<Record<string, string>>(() => {
    const style: Record<string, string> = { position: 'absolute' };
    const pos = this.position(); // On appelle la fonction input
    if (typeof pos === 'string') {
      switch (pos) {
        case 'center':
          return {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          };
        case 'top-left':
          return {
            position: 'absolute',
            top: '0',
            left: '0'
          };
        // Si on a d’autres positions prédéfinies, on les ajoute ici
      }
    }
    if (this.width())  style['width'] = coerceCssValue(this.width());
    if (this.height()) style['height'] = coerceCssValue(this.height());
    return style;
  });

  constructor() {
    effect(() => {
      if (this.contentRef()) this.contentReady.emit();
    });

    effect(() => {
      if (this.disposeOnNavigation()) 
        this._router.events.pipe(
          takeUntilDestroyed(this._destroyRef)
        ).subscribe(() => this.requestClose.emit());
    }, {
      allowSignalWrites: true
    });
  }

  public onBackdropClick(event: MouseEvent): void {
    if (this.closeOnOutsideClick()) 
        this.requestClose.emit();
  }

}
