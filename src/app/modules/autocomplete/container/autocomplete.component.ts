import {
  Component,
  contentChildren,
  effect,
  inject,
  Injector,
  signal,
  TemplateRef,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { C3OptionComponent } from '../option/option.component';
import { C3DropdownService } from '../../dropdown/dropdown.service';
import { c3Watch } from '../../../utils/watch';
import { C3DropdownComponent } from '../../dropdown/dropdown-component/dropdown.component';

@Component({
selector: 'c3-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
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
    effect(() => this.focusedItem()?.item && this.focusedItem().item.select(), {
      allowSignalWrites: true,
    });

    c3Watch(
      this.items,
      (items, oldvalue) =>
        items.length > 0 &&
        !oldvalue.length &&
        this.focusedItem.set({
          position: 0,
          item: items[0],
        }),
      {
        allowSignalWrites: true,
        immediate: true,
      },
    );
  }

  public open() {
    if (this.isOpen()) return;

    this.isOpen.set(true);
    const dropdown = this.dropdownService.open({
      element: this.inputRef(),
      templateRef: this.templateRef(),
      position: 'below',
      closeOnOutsideClick: true,
    });

    if (dropdown) {
      dropdown.afterMounted.subscribe((ref) => {
        this.dropdownRef.set(ref);
      });
    }
  }

  public close() {
    this.isOpen.set(false);
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
    const position = this.focusedItem()?.position ?? -1;
    const nextPosition = position + 1;
    if (nextPosition < this.items().length) {
      this.focusedItem()?.item.deselect();
      this.focusedItem.set({
        position: nextPosition,
        item: this.items()[nextPosition],
      });
    }
  }

  public selectPreviousItem() {
    const position = this.focusedItem()?.position ?? -1;
    const previousPosition = position - 1;
    if (previousPosition >= 0) {
      this.focusedItem()?.item.deselect();
      this.focusedItem.set({
        position: previousPosition,
        item: this.items()[previousPosition],
      });
    }
  }
}
