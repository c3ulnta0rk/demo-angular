import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ScrollDispatcherService } from '../scrollDispatcher/scrollDispatcher.service';
import { C3MountedDropdown } from './dropdown.service';

@Component({
  selector: 'c3-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class C3DropdownComponent<T> {
  public readonly element = input<HTMLElement>();
  public readonly component = input<Type<T>>();
  public readonly templateRef = input<TemplateRef<T>>();
  public readonly position = input<
    'above' | 'beside' | 'below' | 'left' | 'auto'
  >('auto');
  public readonly closeOnOutsideClick = input<boolean>(false);

  public readonly componentRef = signal<ComponentRef<T>>(undefined);

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scrollDispatcherService = inject(ScrollDispatcherService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly viewContainerRef = inject(ViewContainerRef);

  public readonly top = signal<number>(0);
  public readonly left = signal<number>(0);
  public readonly minWidth = signal<number>(0);
  public readonly visible = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.component()) {
        this.openDropdown();
      }
    });
  }

  private openDropdown(): void {
    if (!this.component() && !this.templateRef()) return;

    if (this.component()) {
      const componentRef = this.viewContainerRef.createComponent(
        this.component()
      );
      this.componentRef.set(componentRef);
    } else if (this.templateRef()) {
      const viewRef = this.viewContainerRef.createEmbeddedView(
        this.templateRef()
      );
    }
  }

  #adjustPosition(
    rect: DOMRect,
    position: string,
    viewportHeight: number
  ): void {
    const elementHeight = rect.height;

    switch (position) {
      case 'above':
        this.#positionAbove();
        break;
      case 'beside':
        this.#positionBeside(elementHeight);
        break;
      case 'left':
        this.#positionLeft();
        break;
      case 'auto':
      case 'below':
      default:
        this.#positionBelow(rect, elementHeight, viewportHeight);
        break;
    }
  }

  #positionAbove(): void {
    this.top.update((oldvalue) => oldvalue - 5);
  }

  #positionBeside(elementHeight: number): void {
    this.left.update((oldvalue) => oldvalue + elementHeight);
  }

  #positionLeft(): void {
    // componentRef.left.next(componentRef.left.value - 5);
    this.left.update((oldvalue) => oldvalue - 5);
  }

  #positionBelow(
    rect: DOMRect,
    elementHeight: number,
    viewportHeight: number
  ): void {
    this.top.update((oldvalue) => {
      const bottom = rect.bottom + 100;
      const diff = bottom - viewportHeight;
      return oldvalue + elementHeight + (diff > 0 ? diff + 20 : 0);
    });
  }
}
