
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortableService {
  private draggedItem: HTMLElement | null = null;
  private targetItem: HTMLElement | null = null;
  private placeholder: HTMLElement | null = null;

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
    if (this.draggedItem && this.targetItem) {
      const container = this.draggedItem.parentElement;
      if (container) {
        const items = Array.from(container.children);
        const draggedIdx = items.indexOf(this.draggedItem);
        const targetIdx = items.indexOf(this.targetItem);
        
        if (draggedIdx > targetIdx) {
          this.targetItem.parentNode?.insertBefore(this.draggedItem, this.targetItem);
        } else {
          this.targetItem.parentNode?.insertBefore(this.draggedItem, this.targetItem.nextSibling);
        }
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
