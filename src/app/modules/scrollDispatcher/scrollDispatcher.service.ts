import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollDispatcherService {
  private scrollSubject = new BehaviorSubject<Element | null>(null);
  private scrollMap = new Map<Element, Observable<unknown>>();
  private scrollSubscriptions: Map<Element, Subscription> = new Map();

  public get scrollObservable(): Observable<Element> {
    return this.scrollSubject.asObservable();
  }

  public getScrollContainerObservableForElement(
    element: HTMLElement
  ): [Element, Observable<unknown>] {
    const scrollContainerElement = element.closest('.c3-scrollable_container');
    if (!scrollContainerElement) return [element, fromEvent(element, 'scroll')];

    return [scrollContainerElement, this.scrollMap.get(scrollContainerElement)];
  }

  attach(element: ElementRef<any>) {
    if (this.scrollMap.has(element.nativeElement)) return;

    // add custom class to element
    element.nativeElement.classList.add('c3-scrollable_container');
    const scrollEventObservable = fromEvent(element.nativeElement, 'scroll');
    this.scrollMap.set(element.nativeElement, scrollEventObservable);

    const scrollEventSubscription = scrollEventObservable.subscribe(() => {
      this.scrollSubject.next(element.nativeElement);
    });
    this.scrollSubscriptions.set(
      element.nativeElement,
      scrollEventSubscription
    );
  }

  detach(element: ElementRef<any>) {
    const subscription = this.scrollSubscriptions.get(element.nativeElement);
    if (subscription) {
      subscription.unsubscribe();
      this.scrollSubscriptions.delete(element.nativeElement);
    }
  }
}
