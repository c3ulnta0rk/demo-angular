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
} from '@angular/core';
import { ScrollDispatcherService } from '../scrollDispatcher/scrollDispatcher.service';
import {
  filter,
  fromEvent,
  interval,
  map,
  Observable,
  skipUntil,
  Subject,
  Subscription,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'c3-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class C3DropdownComponent<T> {
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
    () => this.componentRef()?.instance
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

  private readonly scrollSubscription = signal<Subscription | undefined>(
    undefined
  );
  private readonly clickOutsideSubscription = signal<Subscription | undefined>(
    undefined
  );

  constructor() {
    effect(
      () => {
        if ((this.component() || this.templateRef()) && !this.componentRef()) {
          this.openDropdown();
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  private openDropdown() {
    if ((!this.component() && !this.templateRef()) || !this.viewContainerRef())
      throw new Error('ViewContainerRef not found');

    if (this.component()) {
      const componentRef = this.viewContainerRef().createComponent(
        this.component()
      );
      this.componentRef.set(componentRef);
    } else if (this.templateRef()) {
      const viewRef = this.viewContainerRef().createEmbeddedView(
        this.templateRef()
      );

      this.componentRef.set(viewRef.rootNodes[0] as ComponentRef<T>);
    }

    this.#calculatePosition(this.position());

    this.#subscribeToScroll();

    if (this.closeOnOutsideClick()) {
      this.#clickOutsideSubscription();
    }

    // const componentMounted = new Subject<ComponentRef<T> | undefined>();
  }

  #getClickOutsideObservable(element: HTMLElement) {
    return fromEvent(document, 'click').pipe(
      filter((event) => !element.contains(event.target as Node)),
      map(() => element)
    );
  }

  #clickOutsideSubscription(): void {
    if (!this.element() || !this.componentRef()) return;

    const clickOutsideSubscription = this.#getClickOutsideObservable(
      this.element()
    )
      .pipe(
        skipUntil(interval(100)),
        filter(Boolean),
        filter((target) => this.element().isEqualNode(target)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.close.emit();

        this.clickOutsideSubscription().unsubscribe();
        this.clickOutsideSubscription.set(undefined);
      });

    this.clickOutsideSubscription.set(clickOutsideSubscription);
  }

  #subscribeToScroll(): void {
    if (!this.element()) return;

    const parentScrollObservable =
      this.scrollDispatcherService.getScrollContainerObservableForElement(
        this.element()
      );

    if (!parentScrollObservable?.length) return;

    const [, scrollObservable] = parentScrollObservable;

    if (scrollObservable) {
      const scrollSubscription = scrollObservable.subscribe(() =>
        this.#calculatePosition(this.position())
      );

      this.scrollSubscription.set(scrollSubscription);
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

    const [scrollContainerElement] =
      this.scrollDispatcherService.getScrollContainerObservableForElement(
        element
      );
    const scrollContainerRect = scrollContainerElement?.getBoundingClientRect();

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
    scrollContainerRect: DOMRect | undefined
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
      if (!rect || !elementHeight || !viewportHeight) return oldvalue;
      const bottom = rect.bottom + 100;
      const diff = bottom - viewportHeight;
      return oldvalue + elementHeight + (diff > 0 ? diff + 5 : 5);
    });
  }
}
