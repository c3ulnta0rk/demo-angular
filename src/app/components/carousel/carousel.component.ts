import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  ContentChildren,
  ElementRef,
  EventEmitter,
  output,
  Output,
  QueryList,
  viewChild,
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
  public c3OnScrollEnd = output<void>();
  public carouselItems = contentChildren(CarouselItemDirective, {
    descendants: true,
  });
  public scroller = viewChild('scroller', {
    read: ElementRef,
  });
  private animationId: number | null = null;

  scrollItems(direction: number): void {
    const currentScrollPosition = this.scroller().nativeElement.scrollLeft;
    const itemWidth =
      this.carouselItems().at(0)._elementRef.nativeElement.offsetWidth;
    let padding = 0;
    // Prendre en compte le padding uniquement si le scroll est à 0
    if (currentScrollPosition === 0 && window) {
      const scrollerStyle = window.getComputedStyle(
        this.scroller().nativeElement
      );
      padding = parseInt(scrollerStyle.paddingLeft, 10);
    }
    const newScrollPosition =
      currentScrollPosition + (itemWidth + padding) * direction;
    this.scroller().nativeElement.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    });
    this.onScroll();
  }

  onDrag(event: { deltaX: number; deltaY: number }): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    this.animationId = requestAnimationFrame(() => {
      const currentScrollPosition = this.scroller().nativeElement.scrollLeft;
      const newScrollPosition = currentScrollPosition - event.deltaX;
      this.scroller().nativeElement.scrollTo({
        left: newScrollPosition,
        behavior: 'auto',
      });
      this.animationId = null;
    });
  }

  onScroll(): void {
    const element = this.scroller().nativeElement;
    const isScrollingEnd =
      element.scrollLeft + element.clientWidth >= element.scrollWidth;
    if (isScrollingEnd) {
      this.c3OnScrollEnd.emit();
    }
  }

  ngOnDestroy() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
