import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C3DropdownService } from './dropdown.service';
import { C3DropdownComponent } from './dropdown-component/dropdown.component';
import { C3TemplateDropdownComponent } from './template-dropdown/template-dropdown.component';
import { DropdownActivatorDirective } from './directives/dropdown-activator.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    C3DropdownComponent,
    C3TemplateDropdownComponent,
    DropdownActivatorDirective,
  ],
  providers: [C3DropdownService],
  exports: [
    C3DropdownComponent,
    C3TemplateDropdownComponent,
    DropdownActivatorDirective,
  ],
})
export class C3DropdownModule {}
