import { ElementRef, Injectable, signal, computed } from '@angular/core';

export interface ScrollEvent {
  element: Element;
  scrollTop: number;
  scrollLeft: number;
}

@Injectable({
  providedIn: 'root',
})
export class ScrollDispatcherService {
  private readonly scrollElements = signal<Map<Element, ScrollEvent>>(new Map());
  private readonly scrollListeners = new Map<Element, () => void>();

  public readonly scrollSignal = computed(() => {
    const elements = this.scrollElements();
    return Array.from(elements.values());
  });

  public readonly latestScrollElement = signal<Element | null>(null);

  public getScrollDataForElement(element: HTMLElement): ScrollEvent | null {
    const scrollContainerElement = element.closest('.c3-scrollable_container');
    const targetElement = scrollContainerElement || element;
    return this.scrollElements().get(targetElement) || null;
  }

  attach(element: ElementRef<HTMLElement>): void {
    if (this.scrollListeners.has(element.nativeElement)) return;

    element.nativeElement.classList.add('c3-scrollable_container');

    const scrollListener = () => {
      const scrollEvent: ScrollEvent = {
        element: element.nativeElement,
        scrollTop: element.nativeElement.scrollTop,
        scrollLeft: element.nativeElement.scrollLeft
      };

      this.scrollElements.update(map => {
        const newMap = new Map(map);
        newMap.set(element.nativeElement, scrollEvent);
        return newMap;
      });

      this.latestScrollElement.set(element.nativeElement);
    };

    element.nativeElement.addEventListener('scroll', scrollListener, { passive: true });
    this.scrollListeners.set(element.nativeElement, () => {
      element.nativeElement.removeEventListener('scroll', scrollListener);
    });
  }

  detach(element: ElementRef<HTMLElement>): void {
    const cleanup = this.scrollListeners.get(element.nativeElement);
    if (cleanup) {
      cleanup();
      this.scrollListeners.delete(element.nativeElement);
    }

    this.scrollElements.update(map => {
      const newMap = new Map(map);
      newMap.delete(element.nativeElement);
      return newMap;
    });

    if (this.latestScrollElement() === element.nativeElement) {
      this.latestScrollElement.set(null);
    }
  }

  detachAll(): void {
    this.scrollListeners.forEach(cleanup => cleanup());
    this.scrollListeners.clear();
    this.scrollElements.set(new Map());
    this.latestScrollElement.set(null);
  }
}
