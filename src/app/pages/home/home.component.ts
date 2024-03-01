import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CardComponent } from '../../components/card/card.component';
import { CarouselItemDirective } from '../../components/carousel/carousel-item.directive';
import { ScrollDispatcherService } from '../../modules/scrollDispatcher/scrollDispatcher.service';
import { DropdownService } from '../../components/dropdown/dropdown.service';
import { SampleComponent } from '../../components/sample/sample.component';

@Component({
  selector: 'c3-home',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    CardComponent,
    CarouselItemDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  #dropdownService = inject(DropdownService);
  public items = Array.from({ length: 20 }, (_, i) => i + 1);

  openDropdown($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    const element = $event.target as HTMLElement;
    this.#dropdownService.toggleDropdown({
      element,
      component: SampleComponent,
      position: 'below',
    });
  }
}
