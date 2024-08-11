import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C3DropdownComponent } from './dropdown.component';
import { C3DropdownService } from './dropdown.service';

@NgModule({
  imports: [CommonModule, C3DropdownComponent],
  providers: [C3DropdownService],
})
export class C3DropdownModule {}
