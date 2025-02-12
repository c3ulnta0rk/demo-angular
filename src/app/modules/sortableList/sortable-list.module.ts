
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableListDirective } from './directives/sortableList.directive';
import { DraggableDirective } from './directives/draggable.directive';

@NgModule({
  declarations: [SortableListDirective, DraggableDirective],
  imports: [CommonModule],
  exports: [SortableListDirective, DraggableDirective]
})
export class SortableListModule { }
