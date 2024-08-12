import {
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  Signal,
  TemplateRef,
  Type,
} from '@angular/core';
import { C3InjectorService } from '../../services/injector';
import { c3ApplyInputValues } from '../../utils/fill-inputs';
import { C3DropdownComponent } from './dropdown.component';

export interface C3DropdownConfig<T = any> {
  element: HTMLElement;
  component?: Type<T>;
  templateRef?: TemplateRef<T>;
  position: 'above' | 'beside' | 'below' | 'left' | 'auto';
  closeOnOutsideClick?: boolean;
}

export interface C3MountedDropdown<Type> {
  componentRef?: ComponentRef<Type>;
  viewRef?: EmbeddedViewRef<any>;
  top: Signal<number>;
  left: Signal<number>;
  minWidth: Signal<number>;
  visible: Signal<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class C3DropdownService {
  private readonly _injector = inject(C3InjectorService);
  private readonly _mountedDropdowns = new Map<
    C3DropdownComponent<any>,
    ComponentRef<C3DropdownComponent<any>>
  >();

  public open<MountedComponent>(
    config: C3DropdownConfig<MountedComponent>
  ): C3DropdownComponent<MountedComponent> | void {
    const dropdown = this._injector.injectComponent(
      C3DropdownComponent<MountedComponent>
    );
    if (!dropdown) return;

    this._mountedDropdowns.set(dropdown.instance, dropdown);

    c3ApplyInputValues(C3DropdownComponent, config, dropdown);

    const closeSubscription = dropdown.instance.close.subscribe(() => {
      this.close(dropdown);
      closeSubscription.unsubscribe();
    });

    return dropdown.instance;
  }

  public close(
    componentRef: ComponentRef<any> | C3DropdownComponent<any>
  ): void {
    if (componentRef instanceof C3DropdownComponent) {
      const mountedDropdown = this._mountedDropdowns.get(componentRef);
      this._mountedDropdowns.delete(componentRef);
      this._injector.removeComponent(mountedDropdown);
    } else return this._injector.removeComponent(componentRef);
  }
}
