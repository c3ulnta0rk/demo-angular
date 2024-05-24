import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  output,
} from '@angular/core';
import { OnClickOutsideService } from './onClickOutside.service';

@Directive({
  selector: '[c3OnClickOutside]',
  standalone: true,
})
export class C3OnClickOutsideDirective implements OnDestroy {
  public c3SkipCount = input(1);
  public c3OnClickOutside = output<MouseEvent>();

  onClickOutsideService = inject(OnClickOutsideService);

  constructor(private readonly elementRef: ElementRef) {
    this.onClickOutsideService.subscribe(
      this.elementRef.nativeElement,
      (event) => this.c3OnClickOutside.emit(event),
    );
  }

  ngOnDestroy() {
    this.onClickOutsideService.unsubscribe(this.elementRef.nativeElement);
  }
}
