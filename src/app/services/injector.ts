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
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class C3InjectorService {
  private readonly applicationRef = inject(ApplicationRef);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public injectComponent<T>(component: Type<T>): ComponentRef<T> | void {
    if (isPlatformServer(this.platformId)) return;

    const container = document.createElement('div');

    container.classList.add('injected-component');
    document.body.appendChild(container);

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
