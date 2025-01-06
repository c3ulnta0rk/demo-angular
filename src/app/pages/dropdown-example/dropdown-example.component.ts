import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { C3CardComponent } from '../../components/card/card.component';
import { CarouselItemDirective } from '../../components/carousel/carousel-item.directive';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { C3OnScrollEndDirective } from '../../directives/onScrollEnd.directive';
import { SampleComponent } from '../../components/sample/sample.component';
import { C3DropdownService } from '../../modules/dropdown/dropdown.service';
import { C3DropdownModule } from '../../modules/dropdown/dropdown.module';
import { C3DropdownComponent } from '../../modules/dropdown/dropdown-component/dropdown.component';

@Component({
  selector: 'c3-dropdown-example',
  imports: [
    C3CardComponent,
    C3DropdownModule,
    C3OnScrollEndDirective,
    CarouselComponent,
    CarouselItemDirective,
    CommonModule,
  ],
  templateUrl: './dropdown-example.component.html',
  styleUrl: './dropdown-example.component.scss',
})
export class DropdownExamplePageComponent {
  private readonly _dropdown = inject(C3DropdownService);
  public readonly items = Array.from({ length: 178 }, (_, i) => i + 1);
  private readonly dropdowns = signal(
    new Map<number, C3DropdownComponent<SampleComponent>>(),
  );

  openDropdown($event: MouseEvent, items: number): void {
    const element = $event.target as HTMLElement;
    if (this.dropdowns().has(items)) {
      this._dropdown.close(this.dropdowns().get(items));
      this.dropdowns().delete(items);
    } else {
      const mountedDropdown = this._dropdown.open<SampleComponent>({
        element,
        component: SampleComponent,
        position: 'below',
        closeOnOutsideClick: false,
      });

      if (!mountedDropdown) return;

      mountedDropdown.afterMounted.subscribe((ref) => {
        ref.componentRefInstance().txt = `Coucou Dédé Dropdownifou c'est c3-${items}`;
        if (!this.dropdowns().has(items)) this.dropdowns().set(items, ref);

        const closeSubscription = ref.close.subscribe(() => {
          this.dropdowns().delete(items);
          closeSubscription.unsubscribe();
        });
      });
    }
  }

  onScrollEnd() {
    // const itemsLength = this.items.length;
    // this.items.push(
    //   ...Array.from({ length: 20 }, (_, i) => itemsLength + i + 1)
    // );
    // this.#cdr.markForCheck();
  }
}
