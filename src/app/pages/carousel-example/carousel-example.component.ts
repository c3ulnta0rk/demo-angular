
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CarouselItemDirective } from '../../components/carousel/carousel-item.directive';
import { C3CardComponent } from '../../components/card/card.component';

@Component({
    selector: 'c3-carousel-example',
    imports: [CommonModule, CarouselComponent, CarouselItemDirective, C3CardComponent],
    templateUrl: './carousel-example.component.html',
    styleUrl: './carousel-example.component.scss'
})
export class CarouselExampleComponent {
  public readonly items = Array.from({ length: 10 }, (_, i) => i + 1);
}
