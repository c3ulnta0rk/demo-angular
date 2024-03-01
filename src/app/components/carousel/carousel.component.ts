import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { startWith } from 'rxjs';
import { CarouselItemDirective } from './carousel-item.directive';
import { AttachScrollDirective } from '../../modules/scrollDispatcher/attachScroll.directive';

@Component({
  selector: 'c3-carousel',
  standalone: true,
  imports: [CommonModule, CarouselItemDirective, AttachScrollDirective],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c3-carousel',
  },
})
export class CarouselComponent {
  @ContentChildren(CarouselItemDirective, { descendants: true })
  carouselItems: QueryList<CarouselItemDirective>;

  @ViewChild('scroller', { static: true }) scroller: ElementRef;

  scrollItems(direction: number): void {
    const currentScrollPosition = this.scroller.nativeElement.scrollLeft;
    const itemWidth =
      this.carouselItems.first._elementRef.nativeElement.offsetWidth;
    let padding = 0;
    // Prendre en compte le padding uniquement si le scroll est à 0
    if (currentScrollPosition === 0) {
      const scrollerStyle = window.getComputedStyle(
        this.scroller.nativeElement,
      );
      padding = parseInt(scrollerStyle.paddingLeft, 10);
    }
    const newScrollPosition =
      currentScrollPosition + (itemWidth + padding) * direction;
    this.scroller.nativeElement.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    });
  }
}
