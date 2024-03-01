import { ComponentRef, Injectable, TemplateRef, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DropdownConfig {
  element: HTMLElement;
  component?: Type<any>;
  templateRef?: TemplateRef<any>;
  position: 'above' | 'beside' | 'below' | 'left' | 'auto';
}

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  #dropdownSubject = new BehaviorSubject<DropdownConfig | null>(null);
  #mountedDropdownsMapSubject = new BehaviorSubject<
    Map<HTMLElement, ComponentRef<unknown>>
  >(new Map());

  addMountedDropdown(
    element: HTMLElement,
    componentRef: ComponentRef<unknown>,
  ): void {
    const currentMap = this.#mountedDropdownsMapSubject.getValue();
    currentMap.set(element, componentRef);
    this.#mountedDropdownsMapSubject.next(currentMap);
  }

  removeMountedDropdown(element: HTMLElement): void {
    const currentMap = this.#mountedDropdownsMapSubject.getValue();
    const componentRef = currentMap.get(element);
    if (componentRef) {
      componentRef.destroy();
      currentMap.delete(element);
      this.#mountedDropdownsMapSubject.next(currentMap);
    }
  }

  getMountedDropdown(element: HTMLElement): ComponentRef<unknown> | undefined {
    return this.#mountedDropdownsMapSubject.getValue().get(element);
  }

  watchMountedDropdowns(): Observable<Map<HTMLElement, ComponentRef<unknown>>> {
    return this.#mountedDropdownsMapSubject.asObservable();
  }

  toggleDropdown(config: DropdownConfig): void {
    // pour le moment, on ne vas autoriser qu'un seul dropdown à la fois
    const mountedDropdownsMap = this.#mountedDropdownsMapSubject.getValue();
    const isDropdownMounted = mountedDropdownsMap.has(config.element);
    if (mountedDropdownsMap.size > 0) {
      for (const [element] of mountedDropdownsMap) {
        this.removeMountedDropdown(element);
      }
    }
    if (!isDropdownMounted) this.#dropdownSubject.next(config);
  }

  getDropdownEmitter(): Observable<DropdownConfig | null> {
    return this.#dropdownSubject.asObservable();
  }
}
