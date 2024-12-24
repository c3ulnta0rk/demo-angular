// c3-overlay-ref.ts
import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';
import { C3OverlayPaneComponent } from './overlay-pane.components';
import { C3InjectorService } from '../injector/injector.service';

/**
 * Représente la référence d’un overlay créé par C3OverlayService.
 * Gère notamment la fermeture, l’instance du composant final, etc.
 */
export class C3OverlayRef<T> {
  /**
   * Événement émis après la fermeture de l’overlay.
   * On expose l’Observable publiquement, et on garde le Subject privé pour émettre.
   */
  private readonly _afterClosed = new Subject<void>();
  public afterClosed$ = this._afterClosed.asObservable();
  private componentRef: ComponentRef<T>;
  private readonly _afterComponentRefMounted = new Subject<ComponentRef<T>>();
  public afterComponentRefMounted$ =
    this._afterComponentRefMounted.asObservable();

  constructor(
    /** Référence du “pane” (ex. backdrop, position, etc.). */
    private readonly paneRef: ComponentRef<C3OverlayPaneComponent>,
    /** Service pour nettoyer le DOM (removeComponent). */
    private readonly injectorService: C3InjectorService,
  ) {
    this.paneRef.instance.requestClose.subscribe(() => this.close());
  }

  /**
   * Permet d’accéder à l’instance du composant final pour ajuster ses @Input()
   * ou appeler des méthodes publiques.
   */
  public get instance(): T {
    return this.componentRef.instance;
  }

  setComponentRef(componentRef: ComponentRef<T>): void {
    this.componentRef = componentRef;
    this._afterComponentRefMounted.next(componentRef);
  }

  /**
   * Ferme (détruit) l’overlay : retire le composant final
   * et le pane du DOM, puis émet l’événement `afterClosed`.
   */
  public close(): void {
    // 1) Retirer le composant final du DOM
    if (this.componentRef) {
      this.injectorService.removeComponent(this.componentRef);
      this.componentRef = null;
    }

    // 2) Retirer le pane du DOM
    this.injectorService.removeComponent(this.paneRef);

    // 3) Émettre l’événement de fermeture
    this._afterClosed.next();
    this._afterClosed.complete();
  }
}
