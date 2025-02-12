
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
    
    // Create placeholder
    const placeholder = element.cloneNode(true) as HTMLElement;
    placeholder.style.position = 'fixed';
    placeholder.style.left = `${rect.left}px`;
    placeholder.style.top = `${rect.top}px`;
    placeholder.style.width = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    placeholder.style.opacity = '0.8';
    placeholder.style.pointerEvents = 'none';
    placeholder.style.transition = 'all 0.2s ease-out';
    placeholder.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    placeholder.style.transform = 'scale(1.02)';
    placeholder.style.zIndex = '1000';
    placeholder.style.background = '#ffffff';
    placeholder.style.border = '2px solid #4a90e2';
    placeholder.style.borderRadius = '4px';
    document.body.appendChild(placeholder);

    this.sortableService.setDraggedItem(element, placeholder);
    event.dataTransfer?.setData('text/plain', '');
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
