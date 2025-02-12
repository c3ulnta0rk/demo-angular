
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[sortableContainer]'
})
export class SortableContainerDirective {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
