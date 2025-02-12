
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableContainerDirective } from './directives/sortable-container.directive';
import { SortableItemDirective } from './directives/sortable-item.directive';

@NgModule({
  declarations: [SortableContainerDirective, SortableItemDirective],
  imports: [CommonModule],
  exports: [SortableContainerDirective, SortableItemDirective]
})
export class SortableListModule {}
