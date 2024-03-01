import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollDispatcherService {
  private scrollSubject = new BehaviorSubject<ElementRef<any> | null>(null);
  private scrollSubscriptions: Map<ElementRef<any>, Subscription> = new Map();

  constructor() {}

  public get scrollObservable(): Observable<ElementRef<any>> {
    return this.scrollSubject.asObservable();
  }

  attach(element: ElementRef<any>) {
    const scrollEventSubscription = fromEvent(
      element.nativeElement,
      'scroll',
    ).subscribe(() => {
      this.scrollSubject.next(element);
    });
    this.scrollSubscriptions.set(element, scrollEventSubscription);
  }

  detach(element: ElementRef<any>) {
    const subscription = this.scrollSubscriptions.get(element);
    if (subscription) {
      subscription.unsubscribe();
      this.scrollSubscriptions.delete(element);
    }
  }
}
