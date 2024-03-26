import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';
import { AttachScrollDirective } from '../../modules/scrollDispatcher/attachScroll.directive';
import { C3OnDragDirective } from '../../directives/onDrag.directive';

@Component({
  selector: 'c3-carousel',
  standalone: true,
  imports: [
    CommonModule,
    CarouselItemDirective,
    AttachScrollDirective,
    C3OnDragDirective,
  ],
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
        this.scroller.nativeElement
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

  onDrag(event: { deltaX: number; deltaY: number }): void {
    // define scroll direction of carousel (x or y)
    const scrollDirection = this.getScrollDirection();
    // if scroll direction is x, scroll carousel
    if (scrollDirection === 'x') {
      const currentScrollPosition = this.scroller.nativeElement.scrollLeft;
      const newScrollPosition = currentScrollPosition - event.deltaX;
      console.log('newScrollPosition', event.deltaX);
      this.scroller.nativeElement?.scrollTo({
        left: newScrollPosition,
      });
    }
  }

  getScrollDirection(): 'x' | 'y' {
    const element = this.scroller.nativeElement;
    const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
    const hasVerticalScroll = element.scrollHeight > element.clientHeigh;

    if (hasHorizontalScroll && !hasVerticalScroll) {
      return 'x';
    } else if (!hasHorizontalScroll && hasVerticalScroll) {
      return 'y';
    } else {
      return 'x';
    }
  }
}
