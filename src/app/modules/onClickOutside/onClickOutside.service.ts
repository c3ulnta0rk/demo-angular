import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, filter, fromEvent, skip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OnClickOutsideService {
  #clickOutsideSubscribers = new Map<Node, Subscription>();
  #destroyRef = inject(DestroyRef);

  subscribe(node: Node, callback: (event: MouseEvent) => void): void {
    this.#clickOutsideSubscribers.set(
      node,
      this.#createSubscription(node, callback)
    );
  }

  unsubscribe(node: Node): void {
    this.#clickOutsideSubscribers.get(node)?.unsubscribe();
    this.#clickOutsideSubscribers.delete(node);
  }

  #createSubscription(
    node: Node,
    callback: (event: MouseEvent) => void
  ): Subscription {
    if (!this.#clickOutsideSubscribers.has(node)) {
      return fromEvent<MouseEvent>(document, 'click')
        .pipe(
          skip(1),
          takeUntilDestroyed(this.#destroyRef),
          filter((event) => !node.contains(event.target as Node))
        )
        .subscribe({
          next: callback,
        });
    } else {
      return this.#clickOutsideSubscribers.get(node)!;
    }
  }
}
