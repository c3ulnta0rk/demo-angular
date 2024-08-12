import {
  Component,
  contentChildren,
  effect,
  inject,
  Injector,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { C3OptionComponent } from '../option/option.component';
import { C3DropdownService } from '../../dropdown/dropdown.service';
import { C3DropdownComponent } from '../../dropdown/dropdown.component';
import { c3Watch } from '../../../utils/watch';

@Component({
  selector: 'c3-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class C3AutocompleteComponent {
  public readonly templateRef = viewChild(TemplateRef);

  // requis pour l'autocomplete
  public readonly items = contentChildren(C3OptionComponent);
  public readonly isOpen = signal(false);
  public readonly inputRef = signal<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  public readonly dropdownRef = signal<C3DropdownComponent<any>>(null);

  public focusedItem = signal<{
    position: number;
    item: C3OptionComponent;
  } | null>(null);

  // non requis
  private readonly dropdownService = inject(C3DropdownService);
  private readonly _injector = inject(Injector);

  constructor() {
    effect(
      () => {
        if (this.focusedItem()) this.focusedItem().item.select();
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  public open() {
    if (this.isOpen()) return;

    this.isOpen.set(true);
    const dropdown = this.dropdownService.open({
      element: this.inputRef(),
      templateRef: this.templateRef(),
      position: 'below',
      closeOnOutsideClick: false,
    });

    if (dropdown) {
      this.dropdownRef.set(dropdown);
      c3Watch(
        dropdown.componentRefInstance,
        (instance) => {
          console.log('instance', instance);
          if (instance) {
            console.log('instance', instance);
            instance.items = this.items();
          }
        },
        {
          immediate: true,
          injector: this._injector,
        }
      );
    }
  }

  public close() {
    this.isOpen.set(false);
    // this.dropdownService.removeMountedDropdown(this.inputRef());
  }

  public keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }

    if (event.key === 'Enter') {
      this.close();
    }

    if (event.key === 'ArrowDown') {
      this.selectNextItem();
    }

    if (event.key === 'ArrowUp') {
      this.selectPreviousItem();
    }
  }

  public selectNextItem() {
    const position = this.focusedItem().position;
    const nextPosition = position + 1;
    if (nextPosition < this.items().length) {
      this.focusedItem().item.deselect();
      this.focusedItem.set({
        position: nextPosition,
        item: this.items()[nextPosition],
      });
    }
  }

  public selectPreviousItem() {
    const position = this.focusedItem().position;
    const previousPosition = position - 1;
    if (previousPosition >= 0) {
      this.focusedItem().item.deselect();
      this.focusedItem.set({
        position: previousPosition,
        item: this.items()[previousPosition],
      });
    }
  }
}
