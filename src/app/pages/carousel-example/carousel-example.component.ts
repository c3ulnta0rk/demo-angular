

import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CarouselItemDirective } from '../../components/carousel/carousel-item.directive';
import { C3CardComponent } from '../../components/card/card.component';

@Component({
selector: 'c3-carousel-example',
    imports: [CarouselComponent, CarouselItemDirective, C3CardComponent],
    templateUrl: './carousel-example.component.html',
    styleUrl: './carousel-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselExampleComponent {
  public readonly items = Array.from({ length: 10 }, (_, i) => i + 1);
  public currentIndex = signal<number>(0);

  onIndexChanged(index: number): void {
    this.currentIndex.set(index);
    console.log('Index changed to:', index);
  }

  onSlideStart(index: number): void {
    console.log('Slide started from:', index);
  }

  onSlideEnd(index: number): void {
    console.log('Slide ended at:', index);
  }
}
