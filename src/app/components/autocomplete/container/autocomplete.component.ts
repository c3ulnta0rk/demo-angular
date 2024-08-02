import {
  Component,
  contentChildren,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { C3OptionComponent } from '../option/option.component';
import {
  DropdownService,
  MountedDropdown,
} from '../../dropdown/dropdown.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'c3-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class C3AutocompleteComponent {
  public readonly templateRef = viewChild('template', { read: TemplateRef });
  public readonly items = contentChildren(C3OptionComponent);
  public readonly isOpen = signal(false);
  public readonly inputRef = signal<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);

  private readonly dropdownService = inject(DropdownService);

  public open() {
    this.isOpen.set(true);
    this.dropdownService
      .toggleDropdown({
        element: this.inputRef(),
        templateRef: this.templateRef(),
        position: 'below',
        closeOnOutsideClick: true,
      })
      .subscribe();
  }

  public close() {
    this.isOpen.set(false);
    this.dropdownService.removeMountedDropdown(this.inputRef());
  }
}
