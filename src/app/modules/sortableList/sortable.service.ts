
import { Injectable } from '@angular/core';
import { SortableContainerDirective } from './directives/sortable-container.directive';

@Injectable({
  providedIn: 'root'
})
export class SortableService {
  private draggedItem: HTMLElement | null = null;
  private targetItem: HTMLElement | null = null;
  private placeholder: HTMLElement | null = null;
  private container: SortableContainerDirective | null = null;

  setContainer(container: SortableContainerDirective): void {
    this.container = container;
  }

  setDraggedItem(element: HTMLElement, placeholder: HTMLElement): void {
    this.draggedItem = element;
    this.placeholder = placeholder;
  }

  updateTargetItem(element: HTMLElement): void {
    if (element !== this.draggedItem) {
      this.targetItem = element;
    }
  }

  updatePlaceholderPosition(x: number, y: number): void {
    if (this.placeholder && this.draggedItem) {
      const rect = this.draggedItem.getBoundingClientRect();
      this.placeholder.style.left = `${x - rect.width / 2}px`;
      this.placeholder.style.top = `${y - rect.height / 2}px`;
    }
  }

  handleDrop(): void {
    if (this.draggedItem && this.targetItem && this.container) {
      const containerElement = this.container.elementRef.nativeElement;
      const items = Array.from(containerElement.children);
      const draggedIdx = items.indexOf(this.draggedItem);
      const targetIdx = items.indexOf(this.targetItem);
      
      if (draggedIdx > targetIdx) {
        this.targetItem.parentNode?.insertBefore(this.draggedItem, this.targetItem);
      } else {
        this.targetItem.parentNode?.insertBefore(this.draggedItem, this.targetItem.nextSibling);
      }
    }
    
    if (this.placeholder) {
      this.placeholder.remove();
    }
    
    this.draggedItem = null;
    this.targetItem = null;
    this.placeholder = null;
  }
}
