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
import { AttachScrollDirective } from '../../modules/scrollDispatcher/attachScroll.directive';
import { filter } from 'rxjs';
import { C3OnScrollEndDirective } from '../../directives/onScrollEnd.directive';

@Component({
  selector: 'c3-home',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    CardComponent,
    CarouselItemDirective,
    AttachScrollDirective,
    C3OnScrollEndDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  #dropdownService = inject(DropdownService);
  public items = Array.from({ length: 20 }, (_, i) => i + 1);

  openDropdown($event: MouseEvent, items: number): void {
    $event.stopImmediatePropagation();
    const element = $event.target as HTMLElement;
    this.#dropdownService
      .toggleDropdown<SampleComponent>({
        element,
        component: SampleComponent,
        position: 'below',
        closeOnOutsideClick: true,
      })
      .pipe(filter(Boolean))
      .subscribe({
        next: (mountedDropdown) => {
          mountedDropdown.componentRef.instance.txt = `Coucou Dédé Dropdownifou c'est c3-${items}`;
        },
      });
  }

  load() {
    console.log('load');
  }
}
