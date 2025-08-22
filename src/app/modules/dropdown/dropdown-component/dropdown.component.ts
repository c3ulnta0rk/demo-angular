import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  Type,
  viewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ScrollDispatcherService } from '../../scrollDispatcher/scrollDispatcher.service';

@Component({
selector: 'c3-dropdown',
  standalone: false,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C3DropdownComponent<T> implements OnDestroy {
  public readonly element = input<HTMLElement | undefined>();
  public readonly component = input<Type<T> | undefined>();
  public readonly templateRef = input<TemplateRef<T> | undefined>();
  public readonly position = input<
    'above' | 'beside' | 'below' | 'left' | 'auto'
  >('auto');
  public readonly closeOnOutsideClick = input<boolean>(false);

  public readonly close = output<void>();

  public readonly componentRef = signal<ComponentRef<T> | undefined>(undefined);

  public readonly componentRefInstance = computed(
    () => this.componentRef()?.instance,
  );

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scrollDispatcherService = inject(ScrollDispatcherService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly viewContainerRef = viewChild('c3Dropdown', {
    read: ViewContainerRef,
  });

  public readonly top = signal<number>(0);
  public readonly left = signal<number>(0);
  public readonly minWidth = signal<number>(0);
  public readonly visible = signal<boolean>(false);

  private clickOutsideListener: (() => void) | null = null;
  private clickOutsideTimeout: number | null = null;

  constructor() {
    effect(
      () => {
        if ((this.component() || this.templateRef()) && !this.componentRef()) {
          this.openDropdown();
        }
      },
      {
        allowSignalWrites: true,
      },
    );
    
    this.destroyRef.onDestroy(() => this.ngOnDestroy());
  }

  private openDropdown() {
    if ((!this.component() && !this.templateRef()) || !this.viewContainerRef())
      throw new Error('ViewContainerRef not found');

    if (this.component()) {
      const componentRef = this.viewContainerRef().createComponent(
        this.component(),
      );
      this.componentRef.set(componentRef);
    } else if (this.templateRef()) {
      const viewRef = this.viewContainerRef().createEmbeddedView(
        this.templateRef(),
      );

      this.componentRef.set(viewRef.rootNodes[0] as ComponentRef<T>);
    }

    this.#calculatePosition(this.position());
    
    this.#subscribeToScroll();

    if (this.closeOnOutsideClick()) {
      this.#setupClickOutsideListener();
    }
  }

  #setupClickOutsideListener(): void {
    if (!this.element() || !this.componentRef() || this.clickOutsideListener) return;

    this.clickOutsideTimeout = window.setTimeout(() => {
      this.clickOutsideListener = this.#addClickOutsideListener();
      this.clickOutsideTimeout = null;
    }, 100);
  }

  #addClickOutsideListener(): (() => void) {
    const element = this.element();
    if (!element) return () => {};

    const handleClick = (event: Event) => {
      if (!element.contains(event.target as Node)) {
        this.close.emit();
        this.#cleanupClickOutsideListener();
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }

  #cleanupClickOutsideListener(): void {
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
      this.clickOutsideListener = null;
    }
    
    if (this.clickOutsideTimeout !== null) {
      clearTimeout(this.clickOutsideTimeout);
      this.clickOutsideTimeout = null;
    }
  }

  #subscribeToScroll(): void {
    if (!this.element()) return;

    const scrollData = this.scrollDispatcherService.getScrollDataForElement(this.element());
    
    if (scrollData) {
      effect(() => {
        const latestScrollElement = this.scrollDispatcherService.latestScrollElement();
        if (latestScrollElement === scrollData.element) {
          this.#calculatePosition(this.position());
        }
      });
    }
  }

  #calculatePosition<T>(position: string): void {
    const viewportHeight = window.innerHeight;
    const element = this.element();

    if (!this.componentRef() || !element) return;

    const rect = element.getBoundingClientRect();
    this.top.set(rect.top);
    this.left.set(rect.left);
    this.minWidth.set(rect.width);

    const scrollData = this.scrollDispatcherService.getScrollDataForElement(element);
    const scrollContainerRect = scrollData?.element?.getBoundingClientRect();

    // // Check if the element is out of the scroll container
    const isOutOfScroller = this.#isOutOfScroller(rect, scrollContainerRect);

    if (isOutOfScroller) {
      this.visible.set(false);
    } else {
      this.visible.set(true);
      this.#adjustPosition(rect, position, viewportHeight);
    }

    this.cdr.detectChanges();
  }

  #isOutOfScroller(
    rect: DOMRect,
    scrollContainerRect: DOMRect | undefined,
  ): boolean {
    return (
      scrollContainerRect &&
      (rect.top < scrollContainerRect.top ||
        rect.bottom > scrollContainerRect.bottom ||
        rect.left < scrollContainerRect.left ||
        rect.right > scrollContainerRect.right)
    );
  }

  #adjustPosition(
    rect: DOMRect,
    position: string,
    viewportHeight: number,
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
    viewportHeight: number,
  ): void {
    this.top.update((oldvalue) => {
      if (!rect || !elementHeight || !viewportHeight) return oldvalue;
      const bottom = rect.bottom + 100;
      const diff = bottom - viewportHeight;
      return oldvalue + elementHeight + (diff > 0 ? diff + 5 : 5);
    });
  }

  ngOnDestroy(): void {
    this.#cleanupClickOutsideListener();
  }
}
