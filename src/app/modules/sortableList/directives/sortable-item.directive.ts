
import { Directive, ElementRef, HostBinding, HostListener, inject } from '@angular/core';
import { SortableService } from '../sortable.service';

@Directive({
  selector: '[sortableItem]',
  standalone: false
})
export class SortableItemDirective {
  @HostBinding('attr.draggable') draggable = true;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly sortableService = inject(SortableService);

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent): void {
    const element = this.element.nativeElement;
    const rect = element.getBoundingClientRect();

    // add class to element
    element.classList.add('dragging');
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.sortableService.updateTargetItem(this.element.nativeElement);
  }

  @HostListener('drag', ['$event'])
  onDrag(event: DragEvent): void {
    this.sortableService.updatePlaceholderPosition(event.clientX, event.clientY);
  }

  @HostListener('dragend')
  onDragEnd(): void {
    this.sortableService.handleDrop();
  }
}
