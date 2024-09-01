import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropContainerDirective } from './directives/drag-drop-container.directive';
import { DraggableDirective } from './directives/draggable.directive';
import { DropzoneDirective } from './directives/dropzone.directive';

@NgModule({
  declarations: [
    DragDropContainerDirective,
    DraggableDirective,
    DropzoneDirective,
  ],
  imports: [CommonModule],
  exports: [DragDropContainerDirective, DraggableDirective, DropzoneDirective],
})
export class DragDropModule {}
