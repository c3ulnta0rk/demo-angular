import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[dragDropContainer]',
    standalone: false
})
export class DragDropContainerDirective {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
