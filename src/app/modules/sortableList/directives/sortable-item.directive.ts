
import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { SortableService } from '../sortable.service';

@Directive({
  selector: '[sortableItem]'
})
export class SortableItemDirective {
  @HostBinding('attr.draggable') draggable = true;

  constructor(
    private element: ElementRef<HTMLElement>,
    private sortableService: SortableService
  ) {}

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent): void {
    this.sortableService.setDraggedItem(this.element.nativeElement);
    event.dataTransfer?.setData('text/plain', '');
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.sortableService.updateTargetItem(this.element.nativeElement);
  }

  @HostListener('dragend')
  onDragEnd(): void {
    this.sortableService.handleDrop();
  }
}
