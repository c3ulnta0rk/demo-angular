import {
  DestroyRef,
  Directive,
  ElementRef,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, skip } from 'rxjs';

@Directive({
  selector: '[c3OnClickOutside]',
  standalone: true,
})
export class C3OnClickOutsideDirective {
  public c3SkipCount = input(1);
  public c3OnClickOutside = output<MouseEvent>();
  constructor(
    private readonly elementRef: ElementRef,
    private readonly detroyRef: DestroyRef,
  ) {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        skip(this.c3SkipCount()),
        takeUntilDestroyed(this.detroyRef),
        filter(
          (event) =>
            !this.elementRef.nativeElement.contains(event.target as Node),
        ),
      )
      .subscribe({
        next: (event) => this.c3OnClickOutside.emit(event),
      });
  }
}
