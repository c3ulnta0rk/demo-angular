import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[c3CarouselItem]',
  standalone: true,
})
export class CarouselItemDirective {
  constructor(public _elementRef: ElementRef) {}
}
