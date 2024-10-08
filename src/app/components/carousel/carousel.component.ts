import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  ElementRef,
  output,
  viewChild,
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
  private isScrolling: boolean = false;
  private accumulatedDeltaX: number = 0;
  private initialScrollPosition: number = 0;

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
    this.updateScrollPosition();
  }

  onDragStart(): void {
    this.isScrolling = true;
    this.initialScrollPosition = this.scroller().nativeElement.scrollLeft;
    this.accumulatedDeltaX = 0;
  }

  onDrag(event: { deltaX: number; deltaY: number }): void {
    if (!this.isScrolling) return;

    this.accumulatedDeltaX += event.deltaX;

    if (this.animationId === null) {
      this.animationId = requestAnimationFrame(() =>
        this.updateScrollPosition()
      );
    }
  }

  onDragEnd(): void {
    this.isScrolling = false;
    // Ici, vous pourriez ajouter une logique pour l'inertie si nécessaire
  }

  private updateScrollPosition(): void {
    if (!this.isScrolling) {
      this.animationId = null;
      return;
    }

    const newScrollPosition =
      this.initialScrollPosition - this.accumulatedDeltaX;
    this.scroller().nativeElement.scrollLeft = newScrollPosition;

    this.animationId = null;

    if (this.accumulatedDeltaX !== 0) {
      this.animationId = requestAnimationFrame(() =>
        this.updateScrollPosition()
      );
    }
  }

  ngOnDestroy() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
