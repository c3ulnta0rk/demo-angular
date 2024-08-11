import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { C3CardComponent } from '../../components/card/card.component';
import { CarouselItemDirective } from '../../components/carousel/carousel-item.directive';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { C3OnScrollEndDirective } from '../../directives/onScrollEnd.directive';
import { AttachScrollDirective } from '../../modules/scrollDispatcher/attachScroll.directive';
import { filter } from 'rxjs';
import { SampleComponent } from '../../components/sample/sample.component';
import { C3DropdownService } from '../../modules/dropdown/dropdown.service';
import { C3DropdownModule } from '../../modules/dropdown/dropdown.module';

@Component({
  selector: 'c3-dd-example',
  standalone: true,
  imports: [
    AttachScrollDirective,
    C3CardComponent,
    C3DropdownModule,
    C3OnScrollEndDirective,
    CarouselComponent,
    CarouselItemDirective,
    CommonModule,
  ],
  templateUrl: './dd-example.component.html',
  styleUrl: './dd-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DdExampleComponent {
  private readonly _dropdown = inject(C3DropdownService);
  private readonly _cdr = inject(ChangeDetectorRef);
  public readonly items = Array.from({ length: 178 }, (_, i) => i + 1);

  openDropdown($event: MouseEvent, items: number): void {
    const element = $event.target as HTMLElement;
    this._dropdown.open<SampleComponent>({
      element,
      component: SampleComponent,
      position: 'below',
      closeOnOutsideClick: false,
    });
    // this.#dropdownService
    //   .toggleDropdown<SampleComponent>({
    //     element,
    //     component: SampleComponent,
    //     position: 'below',
    //     closeOnOutsideClick: false,
    //   })
    //   .pipe(filter(Boolean))
    //   .subscribe({
    //     next: (mountedDropdown) => {
    //       mountedDropdown.componentRef.instance.txt = `Coucou Dédé Dropdownifou c'est c3-${items}`;
    //     },
    //   });
  }

  onScrollEnd() {
    // const itemsLength = this.items.length;
    // this.items.push(
    //   ...Array.from({ length: 20 }, (_, i) => itemsLength + i + 1)
    // );
    // this.#cdr.markForCheck();
  }
}
