import {
  ComponentRef,
  effect,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector,
  Signal,
  TemplateRef,
  Type,
  signal,
} from '@angular/core';
import { c3ApplyInputValues } from '../../utils/fill-inputs';
import { C3InjectorService } from '../injector/injector.service';
import { C3DropdownComponent } from './dropdown-component/dropdown.component';

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

export interface DropdownReference<T> {
  close: () => void;
  afterMounted: Signal<C3DropdownComponent<T> | null>;
}

@Injectable({
  providedIn: 'root',
})
export class C3DropdownService {
  private readonly _c3Injector = inject(C3InjectorService);
  private readonly _mountedDropdowns = new Map<
    C3DropdownComponent<any>,
    ComponentRef<C3DropdownComponent<any>>
  >();
  private readonly _injector = inject(Injector);

  public open<MountedComponent>(config: C3DropdownConfig<MountedComponent>): DropdownReference<MountedComponent> {
    const dropdown = this._c3Injector.injectComponent(
      C3DropdownComponent<MountedComponent>,
    );
    if (!dropdown) throw new Error('Could not create dropdown component');

    this._mountedDropdowns.set(dropdown.instance, dropdown);

    c3ApplyInputValues(C3DropdownComponent, config, dropdown);

    const afterMountedSignal = signal<C3DropdownComponent<MountedComponent> | null>(null);
    let closeUnsubscriber: (() => void) | null = null;

    const closeSubscription = dropdown.instance.close.subscribe(() => {
      this.close(dropdown);
      if (closeUnsubscriber) {
        closeUnsubscriber();
      }
    });

    closeUnsubscriber = closeSubscription.unsubscribe.bind(closeSubscription);

    const watchInstance = effect(
      () => {
        if (dropdown.instance.componentRef()) {
          afterMountedSignal.set(dropdown.instance);
          watchInstance.destroy();
        }
      },
      {
        injector: this._injector,
        allowSignalWrites: true,
      },
    );

    return {
      close: () => {
        this.close(dropdown);
        if (closeUnsubscriber) {
          closeUnsubscriber();
        }
      },
      afterMounted: afterMountedSignal.asReadonly(),
    };
  }

  public close(
    componentRef: ComponentRef<any> | C3DropdownComponent<any>,
  ): void {
    if (componentRef instanceof C3DropdownComponent) {
      const mountedDropdown = this._mountedDropdowns.get(componentRef);
      this._mountedDropdowns.delete(componentRef);
      this._c3Injector.removeComponent(mountedDropdown);
    } else return this._c3Injector.removeComponent(componentRef);
  }
}
