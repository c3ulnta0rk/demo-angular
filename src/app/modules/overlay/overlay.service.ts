import { ComponentRef, Injectable, Type, inject } from '@angular/core';
import { OverlayConfig } from './overlay-config';
import { C3InjectorService } from '../injector/injector.service';
import { C3OverlayRef } from './overlay-ref';
import { C3OverlayPaneComponent } from './overlay-pane.components';

@Injectable({
  providedIn: 'root',
})
export class C3OverlayService {
  private readonly _injector = inject(C3InjectorService);
  private readonly _overlayRefs: C3OverlayRef<any>[] = [];

  /**
   * Ouvre un composant dans un overlay.
   * @param component Le composant à afficher
   * @param config Config d’overlay (backdrop, position, etc.)
   */
  public open<T>(
    component: Type<T>,
    config?: OverlayConfig<T>,
  ): C3OverlayRef<T> {
    // 1) Injecter un OverlayPane dans l’overlay container
    const overlayPaneRef = this._injector.injectComponent(
      C3OverlayPaneComponent,
    );

    if (!overlayPaneRef) throw new Error('Could not create overlay pane');

    // 2) Apply config
    if (config) this.applyPaneConfig(overlayPaneRef, config);

    const paneElement = overlayPaneRef.instance;
    const overlayRef = new C3OverlayRef<T>(overlayPaneRef, this._injector);
    paneElement.contentReady.subscribe(() => {
      // 2) Injecter le composant final dans le pane
      const componentRef = this._injector.injectComponent(
        component,
        paneElement.contentRef().nativeElement,
      );
      if (!componentRef) throw new Error('Could not create overlay component');

      if (config?.inputs)
        for (const [key, value] of Object.entries(config.inputs))
          componentRef.setInput(key, value);

      overlayRef.setComponentRef(componentRef);
    });

    // 3) Garder la ref de l’overlay pour le fermer plus tard
    this._overlayRefs.push(overlayRef);

    return overlayRef;
  }

  /**
   * Ferme tout ce qui est ouvert (optionnel).
   * Tu peux garder la ref de chaque overlay ouvert pour les fermer.
   */
  public closeAll(): void {
    for (const overlayRef of this._overlayRefs) overlayRef.close();
  }

  private applyPaneConfig<T>(
    overlayPaneRef: ComponentRef<C3OverlayPaneComponent>,
    config: OverlayConfig<T>,
  ) {
    overlayPaneRef.setInput(
      'hasBackdrop',
      config.hasBackdrop !== undefined ? config.hasBackdrop : true,
    );
    overlayPaneRef.setInput('backdropClass', config.backdropClass || '');
    overlayPaneRef.setInput('position', config.position || 'center');
    overlayPaneRef.setInput(
      'closeOnOutsideClick',
      config.closeOnOutsideClick !== undefined
        ? config.closeOnOutsideClick
        : true,
    );
    overlayPaneRef.setInput(
      'disposeOnNavigation',
      config.disposeOnNavigation !== undefined
        ? config.disposeOnNavigation
        : true,
    );
  }
}
