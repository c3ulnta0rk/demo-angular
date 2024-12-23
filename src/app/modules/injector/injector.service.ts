import { isPlatformServer } from '@angular/common';
import {
  ApplicationRef,
  Injectable,
  inject,
  ComponentRef,
  Type,
  createComponent,
  PLATFORM_ID,
  Inject,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

/**
 * Service responsible for dynamically injecting and removing Angular components.
 *
 * @export
 * @class C3InjectorService
 */
@Injectable({
  providedIn: 'root',
})
export class C3InjectorService {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly rendererFactory = inject(RendererFactory2);

  private get renderer(): Renderer2 {
    return this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Creates an instance of C3InjectorService.
   * @param {Object} platformId - The platform ID used to check if the code is running on the server.
   * @memberof C3InjectorService
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  
  /**
   * Injects a component dynamically into the DOM.
   *
   * @template T - The type of the component to be injected.
   * @param {Type<T>} component - The component to be injected.
   * @param {HTMLElement} [host] - Optional host element to inject the component into. If not provided, a new div element will be created.
   * @returns {(ComponentRef<T> | void)} - The reference to the injected component, or void if running on the server.
   * @memberof C3InjectorService
   */
  public injectComponent<T>(component: Type<T>, host?: HTMLElement): ComponentRef<T> | void {
    if (isPlatformServer(this.platformId)) return;
    const container = host || this.renderer.createElement('div');

    if (!host) {
      container.classList.add('injected-component');
      this.renderer.appendChild(document.body, container);
    }

    const componentRef = createComponent(component, {
      environmentInjector: this.applicationRef.injector,
      hostElement: container,
    });

    this.applicationRef.attachView(componentRef.hostView);

    return componentRef;
  }

  /**
   * Removes a dynamically injected component from the DOM.
   *
   * @template T - The type of the component to be removed.
   * @param {ComponentRef<T>} componentRef - The reference to the component to be removed.
   * @memberof C3InjectorService
   */
  public removeComponent<T>(componentRef: ComponentRef<T>): void {
    if (componentRef.location.nativeElement.parentNode) {
      componentRef.location.nativeElement.parentNode.removeChild(
        componentRef.location.nativeElement
      );
    }

    this.applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
