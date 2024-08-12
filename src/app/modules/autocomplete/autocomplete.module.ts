import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C3AutocompleteComponent } from './container/autocomplete.component';
import { C3AutocompleteDirective } from './directive/autocomplete.directive';
import { C3OptionComponent } from './option/option.component';
import { C3DropdownModule } from '../dropdown/dropdown.module';

@NgModule({
  declarations: [
    C3AutocompleteDirective,
    C3AutocompleteComponent,
    C3OptionComponent,
  ],
  imports: [CommonModule, C3DropdownModule],
  exports: [
    C3AutocompleteComponent,
    C3AutocompleteDirective,
    C3OptionComponent,
  ],
})
export class C3AutocompleteModule {}
