import { ComponentRef, signal } from '@angular/core';
import { C3OverlayPaneComponent } from './overlay-pane.components';
import { C3InjectorService } from '../injector/injector.service';

export class C3OverlayRef<T> {
  private readonly _afterClosed = signal(false);
  private readonly _componentRefMounted = signal<ComponentRef<T> | null>(null);
  private componentRef: ComponentRef<T>;
  private requestCloseUnsubscriber: (() => void) | null = null;
  private cleanupCallbacks: (() => void)[] = [];

  public readonly afterClosed = this._afterClosed.asReadonly();
  public readonly componentRefMounted = this._componentRefMounted.asReadonly();

  constructor(
    private readonly paneRef: ComponentRef<C3OverlayPaneComponent>,
    private readonly injectorService: C3InjectorService,
  ) {
    const requestCloseSubscription = this.paneRef.instance.requestClose.subscribe(() => this.close());
    this.requestCloseUnsubscriber = requestCloseSubscription.unsubscribe.bind(requestCloseSubscription);
  }

  public get instance(): T {
    return this.componentRef.instance;
  }

  setComponentRef(componentRef: ComponentRef<T>): void {
    this.componentRef = componentRef;
    this._componentRefMounted.set(componentRef);
  }

  addCleanupCallback(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  public close(): void {
    if (this.componentRef) {
      this.injectorService.removeComponent(this.componentRef);
      this.componentRef = null;
    }

    this.injectorService.removeComponent(this.paneRef);

    this.cleanupCallbacks.forEach(callback => callback());
    this.cleanupCallbacks = [];

    if (this.requestCloseUnsubscriber) {
      this.requestCloseUnsubscriber();
      this.requestCloseUnsubscriber = null;
    }

    this._afterClosed.set(true);
  }
}
