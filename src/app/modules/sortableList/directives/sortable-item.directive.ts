
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
