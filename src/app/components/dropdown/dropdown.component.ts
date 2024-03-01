import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { DropdownConfig, DropdownService } from './dropdown.service';
import { filter, startWith } from 'rxjs';
import { ScrollDispatcherService } from '../../modules/scrollDispatcher/scrollDispatcher.service';

@Component({
  selector: 'c3-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent implements OnInit {
  #dropdownService = inject(DropdownService);
  #cdr = inject(ChangeDetectorRef);
  #scrollDispatcherService = inject(ScrollDispatcherService);
  @ViewChild('dropdown', { read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;

  public top = 0;
  public left = 0;

  ngOnInit(): void {
    this.#dropdownService
      .getDropdownEmitter()
      .pipe(filter((config) => !!config))
      .subscribe((config) => this.#openDropdown(config));
  }

  #openDropdown(config: DropdownConfig): void {
    if (config.component) {
      const componentRef = this.viewContainerRef.createComponent(
        config.component,
      );

      this.#dropdownService.addMountedDropdown(config.element, componentRef);

      this.#scrollDispatcherService.scrollObservable
        .pipe(startWith(null))
        .subscribe(() => {
          this.#calculatePosition(config.element, config.position);
        });
    }
  }

  #calculatePosition(element: HTMLElement, position: string): void {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const rect = element.getBoundingClientRect();
    this.top = rect.top;
    this.left = rect.left;

    // Ajustement en fonction de la hauteur de la vue
    if (rect.bottom + 100 > viewportHeight && position === 'below') {
      this.top -= rect.bottom + 100 - viewportHeight + 20; // Ajoute un peu d'espace
    } else if (rect.top - 100 < 0 && position === 'above') {
      this.top += 100 - rect.top + 20; // Ajoute un peu d'espace
    }

    // Ajustement en fonction de la largeur de la vue
    if (rect.right + 100 > viewportWidth && position === 'beside') {
      this.left -= rect.right + 100 - viewportWidth + 20; // Ajoute un peu d'espace
    } else if (rect.left - 100 < 0 && position === 'left') {
      this.left += 100 - rect.left + 20; // Ajoute un peu d'espace
    }
    const elementHeight = element.offsetHeight;

    switch (position) {
      case 'above':
        this.top -= 5;
        break;
      case 'beside':
        this.left += elementHeight;
        break;
      case 'left':
        this.left -= 5;
        break;
      case 'auto':
      case 'below':
      default:
        this.top += elementHeight;
        break;
    }

    this.#cdr.detectChanges();
  }
}
