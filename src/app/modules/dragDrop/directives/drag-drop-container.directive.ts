import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[dragDropContainer]',
})
export class DragDropContainerDirective {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
