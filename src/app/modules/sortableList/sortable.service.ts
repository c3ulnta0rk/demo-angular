
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortableService {
  private draggedItem: HTMLElement | null = null;
  private targetItem: HTMLElement | null = null;

  setDraggedItem(element: HTMLElement): void {
    this.draggedItem = element;
  }

  updateTargetItem(element: HTMLElement): void {
    if (element !== this.draggedItem) {
      this.targetItem = element;
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
    this.draggedItem = null;
    this.targetItem = null;
  }
}
