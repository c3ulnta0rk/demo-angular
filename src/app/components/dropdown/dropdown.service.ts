import {
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  TemplateRef,
  Type,
} from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';

export interface DropdownConfig {
  element: HTMLElement;
  component?: Type<any>;
  templateRef?: TemplateRef<any>;
  position: 'above' | 'beside' | 'below' | 'left' | 'auto';
  closeOnOutsideClick?: boolean;
}

export interface MountedDropdown<Type> {
  componentRef?: ComponentRef<Type>;
  viewRef?: EmbeddedViewRef<any>;
  top: BehaviorSubject<number>;
  left: BehaviorSubject<number>;
  visible: BehaviorSubject<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  #newDropdownSubject = new BehaviorSubject<DropdownConfig | null>(null);
  #mountedDropdownsMap = new Map<HTMLElement, MountedDropdown<unknown>>();
  #mountedDropdownsMapSubject = new BehaviorSubject<
    Map<HTMLElement, MountedDropdown<unknown>>
  >(this.#mountedDropdownsMap);

  #removedDropdownSubject = new BehaviorSubject<
    [HTMLElement, HTMLElement] | null
  >(null);

  addMountedDropdown(
    element: HTMLElement,
    mountedDropdown: MountedDropdown<unknown>
  ): void {
    this.#mountedDropdownsMap.set(element, mountedDropdown);
    this.#mountedDropdownsMapSubject.next(this.#mountedDropdownsMap);
  }

  removeMountedDropdown(element: HTMLElement): void {
    const mountedDropdown = this.#mountedDropdownsMap.get(element);
    if (mountedDropdown) {
      this.#mountedDropdownsMap.delete(element);
      this.#removedDropdownSubject.next([
        element,
        mountedDropdown.componentRef.location.nativeElement as HTMLElement,
      ]);
      this.#mountedDropdownsMapSubject.next(this.#mountedDropdownsMap);
      mountedDropdown.componentRef.destroy();
    }
  }

  getMountedDropdown<ComponentType>(
    element: HTMLElement
  ): MountedDropdown<ComponentType> | undefined {
    return this.#mountedDropdownsMap.get(
      element
    ) as MountedDropdown<ComponentType>;
  }

  getMountedDropdownByComponentRefElement(element: HTMLElement) {
    return Array.from(this.#mountedDropdownsMap.entries()).find(
      ([_, mountedDropdown]) => {
        const mountedElement = mountedDropdown.componentRef.location
          .nativeElement as HTMLElement;
        return mountedElement.isEqualNode(element);
      }
    );
  }

  getAllMountedDropdowns(): Map<HTMLElement, MountedDropdown<unknown>> {
    return this.#mountedDropdownsMap;
  }

  getRemovedDropdownObservable() {
    return this.#removedDropdownSubject.asObservable();
  }

  getMountedDropdownObservable(): Observable<
    Map<HTMLElement, MountedDropdown<unknown>>
  > {
    return this.#mountedDropdownsMapSubject.asObservable();
  }

  toggleDropdown<ComponentType>(
    config: DropdownConfig
  ): Observable<MountedDropdown<ComponentType> | undefined> {
    return new Observable<MountedDropdown<ComponentType>>((observer) => {
      const isDropdownMounted = this.#mountedDropdownsMap.has(config.element);

      if (!isDropdownMounted) {
        const subscription = this.getMountedDropdownObservable()
          .pipe(filter((map) => map.has(config.element)))
          .subscribe(() => {
            subscription.unsubscribe();
            observer.next(this.getMountedDropdown(config.element));
          });
        this.#newDropdownSubject.next(config);
      } else {
        this.removeMountedDropdown(config.element);
        observer.next();
      }
    });
  }

  getNewDropdownObservable(): Observable<DropdownConfig | null> {
    return this.#newDropdownSubject.asObservable();
  }
}
