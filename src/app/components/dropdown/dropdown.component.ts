import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  DestroyRef,
  EmbeddedViewRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DropdownConfig,
  DropdownService,
  MountedDropdown,
} from './dropdown.service';
import {
  Subscription,
  filter,
  BehaviorSubject,
  merge,
  fromEvent,
  map,
  skipUntil,
  interval,
} from 'rxjs';
import { ScrollDispatcherService } from '../../modules/scrollDispatcher/scrollDispatcher.service';

@Component({
  selector: 'c3-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent implements OnInit {
  public dropdownService = inject(DropdownService);
  #cdr = inject(ChangeDetectorRef);
  #scrollDispatcherService = inject(ScrollDispatcherService);
  #destroyRef = inject(DestroyRef);
  #scrollSubscriptions = new Map<DropdownConfig['element'], Subscription>();
  #styleSubscriptions = new Map<DropdownConfig['element'], Subscription>();
  #clickOutsideSubscriptions = new Map<
    DropdownConfig['element'],
    Subscription
  >();

  @ViewChild('dropdown', { read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;

  ngOnInit() {
    // Subscribes to new dropdown observable and opens the dropdown
    this.dropdownService
      .getNewDropdownObservable()
      .pipe(filter(Boolean), takeUntilDestroyed(this.#destroyRef))
      .subscribe((config) => this.#openDropdown(config));

    // Subscribes to removed dropdown observable and cleans up subscriptions
    this.dropdownService
      .getRemovedDropdownObservable()
      .pipe(takeUntilDestroyed(this.#destroyRef), filter(Boolean))
      .subscribe(([element, mountedElement]) => {
        this.#scrollSubscriptions.get(element)?.unsubscribe();
        this.#scrollSubscriptions.delete(element);

        this.#styleSubscriptions.get(element)?.unsubscribe();
        this.#styleSubscriptions.delete(element);

        this.#clickOutsideSubscriptions.get(mountedElement)?.unsubscribe();
        this.#clickOutsideSubscriptions.delete(mountedElement);
        this.#cdr.detectChanges();
      });
  }

  // Opens a new dropdown based on the provided config
  #openDropdown<Type>(config: DropdownConfig): void {
    if (!config.component && !config.templateRef) return;

    let componentRef: ComponentRef<Type> | null = null;

    if (config.component) {
      componentRef = this.viewContainerRef.createComponent<Type>(
        config.component
      );
    } else if (config.templateRef) {
      const viewRef = this.viewContainerRef.createEmbeddedView(
        config.templateRef
      );
      const newMountedDropdown = this.#createMountedDropdown(
        config,
        null,
        viewRef
      );

      const dropdownElement = viewRef.rootNodes[0];
      dropdownElement.classList.add('c3-dropdown');

      this.#subscribeToStyles(config.element, newMountedDropdown);

      this.#subscribeToScroll(config);

      if (config.closeOnOutsideClick) {
        this.#clickOutsideSubscription(dropdownElement);
      }
      return;
    }

    const newMountedDropdown = this.#createMountedDropdown(
      config,
      componentRef
    );

    const dropdownElement = componentRef.location.nativeElement;
    dropdownElement.classList.add('c3-dropdown');

    this.#subscribeToStyles(config.element, newMountedDropdown);

    this.#subscribeToScroll(config);

    if (config.closeOnOutsideClick) {
      this.#clickOutsideSubscription(
        newMountedDropdown.componentRef.location.nativeElement
      );
    }
  }

  #createMountedDropdown<Type>(
    config: DropdownConfig,
    componentRef: ComponentRef<Type> | null,
    viewRef?: EmbeddedViewRef<any>
  ) {
    const newMountedDropdown = {
      componentRef,
      viewRef,
      top: new BehaviorSubject(0),
      left: new BehaviorSubject(0),
      visible: new BehaviorSubject(true),
    };

    this.dropdownService.addMountedDropdown(config.element, newMountedDropdown);

    return newMountedDropdown;
  }

  #applyStyles<ComponentType>(
    mountedDropdown: MountedDropdown<ComponentType>
  ): void {
    let dropdownElement: HTMLElement;
    if (mountedDropdown.componentRef) {
      dropdownElement = mountedDropdown.componentRef.location.nativeElement;
    } else if (mountedDropdown.viewRef) {
      dropdownElement = mountedDropdown.viewRef.rootNodes[0];
    } else {
      return;
    }

    dropdownElement.style.display = mountedDropdown.visible.value
      ? 'block'
      : 'none';
    dropdownElement.style.top = `${mountedDropdown.top.value}px`;
    dropdownElement.style.left = `${mountedDropdown.left.value}px`;
  }

  #subscribeToStyles<ComponentType>(
    element: HTMLElement,
    mountedDropdown: MountedDropdown<ComponentType>
  ): void {
    const styleSubscription = merge(
      mountedDropdown.top,
      mountedDropdown.left,
      mountedDropdown.visible
    ).subscribe(() => {
      this.#applyStyles(mountedDropdown);
    });

    this.#styleSubscriptions.set(element, styleSubscription);
  }

  #subscribeToScroll(config: DropdownConfig): void {
    const [, parentScrollObservable] =
      this.#scrollDispatcherService.getScrollContainerObservableForElement(
        config.element
      );

    if (parentScrollObservable) {
      const scrollSubscription = parentScrollObservable.subscribe(() =>
        this.#calculatePosition(config.element, config.position)
      );
      this.#calculatePosition(config.element, config.position);

      this.#scrollSubscriptions.set(config.element, scrollSubscription);
    }
  }

  #clickOutsideSubscription(element: HTMLElement): void {
    const clickOutsideSubscription = this.#getClickOutsideObservable(element)
      .pipe(
        skipUntil(interval(100)),
        takeUntilDestroyed(this.#destroyRef),
        filter(Boolean),
        filter((target) => element.isEqualNode(target))
      )
      .subscribe(() => {
        const mountedDropdown =
          this.dropdownService.getMountedDropdownByComponentRefElement(element);

        if (!mountedDropdown) return;

        const [elementKey] = mountedDropdown;
        this.dropdownService.removeMountedDropdown(elementKey);
        this.#clickOutsideSubscriptions.get(elementKey)?.unsubscribe();
        this.#clickOutsideSubscriptions.delete(elementKey);
      });

    this.#clickOutsideSubscriptions.set(element, clickOutsideSubscription);
  }

  // Returns an observable for clicking outside the dropdown element
  #getClickOutsideObservable(element: HTMLElement) {
    return fromEvent(document, 'click').pipe(
      filter((event) => !element.contains(event.target as Node)),
      map(() => element)
    );
  }

  // Calculates the position of the dropdown element based on the viewport and scroll container
  #calculatePosition(element: HTMLElement, position: string): void {
    const viewportHeight = window.innerHeight;
    const componentRef = this.dropdownService.getMountedDropdown(element);

    if (!componentRef) return;

    const rect = element.getBoundingClientRect();
    componentRef.top.next(rect.top);
    componentRef.left.next(rect.left);

    const [scrollContainerElement] =
      this.#scrollDispatcherService.getScrollContainerObservableForElement(
        element
      );
    const scrollContainerRect = scrollContainerElement?.getBoundingClientRect();

    // Check if the element is out of the scroll container
    const isOutOfScroller = this.#isOutOfScroller(rect, scrollContainerRect);

    if (isOutOfScroller) {
      componentRef.visible.next(false);
    } else {
      componentRef.visible.next(true);
      this.#adjustPosition(rect, position, componentRef, viewportHeight);
    }

    this.#cdr.detectChanges();
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

  #adjustPosition<ComponentType>(
    rect: DOMRect,
    position: string,
    componentRef: MountedDropdown<ComponentType>,
    viewportHeight: number
  ): void {
    const elementHeight = rect.height;

    switch (position) {
      case 'above':
        this.#positionAbove(componentRef);
        break;
      case 'beside':
        this.#positionBeside(componentRef, elementHeight);
        break;
      case 'left':
        this.#positionLeft(componentRef);
        break;
      case 'auto':
      case 'below':
      default:
        this.#positionBelow(rect, componentRef, elementHeight, viewportHeight);
        break;
    }
  }

  #positionAbove<ComponentType>(
    componentRef: MountedDropdown<ComponentType>
  ): void {
    componentRef.top.next(componentRef.top.value - 5);
  }

  #positionBeside<ComponentType>(
    componentRef: MountedDropdown<ComponentType>,
    elementHeight: number
  ): void {
    componentRef.left.next(componentRef.left.value + elementHeight);
  }

  #positionLeft<ComponentType>(
    componentRef: MountedDropdown<ComponentType>
  ): void {
    componentRef.left.next(componentRef.left.value - 5);
  }

  #positionBelow<ComponentType>(
    rect: DOMRect,
    componentRef: MountedDropdown<ComponentType>,
    elementHeight: number,
    viewportHeight: number
  ): void {
    componentRef.top.next(componentRef.top.value + elementHeight);
    if (rect.bottom + 100 > viewportHeight) {
      componentRef.top.next(
        componentRef.top.value - rect.bottom + 100 - viewportHeight + 20
      );
    }
  }
}
