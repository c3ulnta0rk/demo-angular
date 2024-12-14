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
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class C3InjectorService {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly renderer = inject(Renderer2);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public injectComponent<T>(component: Type<T>): ComponentRef<T> | void {
    if (isPlatformServer(this.platformId)) return;

    const container = this.renderer.createElement('div');

    container.classList.add('injected-component');
    this.renderer.appendChild(document.body, container);

    const componentRef = createComponent(component, {
      environmentInjector: this.applicationRef.injector,
      hostElement: container,
    });

    this.applicationRef.attachView(componentRef.hostView);

    return componentRef;
  }

  public removeComponent<T>(componentRef: ComponentRef<T>): void {
    // Supprimer le composant du DOM
    if (componentRef.location.nativeElement.parentNode) {
      componentRef.location.nativeElement.parentNode.removeChild(
        componentRef.location.nativeElement
      );
    }

    // Détacher la vue et détruire l'instance du composant
    this.applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
