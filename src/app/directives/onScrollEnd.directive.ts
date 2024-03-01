import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter, fromEvent } from 'rxjs';

@Directive({
  selector: '[c3OnScrollEnd], [c3-on-scroll-end]',
  standalone: true,
})
export class C3OnScrollEndDirective {
  @Output() c3OnScrollEnd = new EventEmitter();

  constructor(private element: ElementRef) {
    fromEvent(element.nativeElement, 'scroll')
      .pipe(
        filter(() => {
          const el = this.element.nativeElement;
          return el.scrollHeight - el.scrollTop === el.clientHeight;
        }),
        debounceTime(100),
        takeUntilDestroyed()
      )
      .subscribe(() => this.c3OnScrollEnd.emit());
  }
}
