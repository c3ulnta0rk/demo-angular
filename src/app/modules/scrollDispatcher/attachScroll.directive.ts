import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { ScrollDispatcherService } from './scrollDispatcher.service';

@Directive({
  selector: '[c3AttachScroll]',
  standalone: true,
})
export class AttachScrollDirective implements OnDestroy {
  #scrollDispatcher = inject(ScrollDispatcherService);
  constructor(private _element: ElementRef) {
    this.#scrollDispatcher.attach(this._element);
  }

  ngOnDestroy() {
    this.#scrollDispatcher.detach(this._element);
  }
}
