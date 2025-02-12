
import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[sortableContainer]',
  standalone: false
})
export class SortableContainerDirective {
  public readonly elementRef = inject(ElementRef<HTMLElement>)
}
