import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  private draggingElement = signal<HTMLElement | null>(null);
  private dropTargets = signal<HTMLElement[]>([]);
  private placeholderElement = signal<HTMLElement | null>(null);

  isDragging = computed(() => !!this.draggingElement());
  currentDropTarget = signal<HTMLElement | null>(null);

  setDraggingElement(element: HTMLElement | null) {
    this.draggingElement.set(element);
  }

  addDropTarget(target: HTMLElement) {
    this.dropTargets.update((targets) => [...targets, target]);
  }

  removeDropTarget(target: HTMLElement) {
    this.dropTargets.update((targets) => targets.filter((t) => t !== target));
  }

  getPlaceholder(): HTMLElement | null {
    return this.placeholderElement();
  }

  setPlaceholder(element: HTMLElement | null) {
    this.placeholderElement.set(element);
  }

  getDropTargetUnderPoint(x: number, y: number): HTMLElement | null {
    return this.dropTargets().reduce((closest, current) => {
      const box = current.getBoundingClientRect();
      const offset = this.pointDistance(
        x,
        y,
        box.left + box.width / 2,
        box.top + box.height / 2
      );
      if (
        offset <
        this.pointDistance(
          x,
          y,
          closest.getBoundingClientRect().left,
          closest.getBoundingClientRect().top
        )
      ) {
        return current;
      } else {
        return closest;
      }
    }, this.dropTargets()[0]);
  }

  private pointDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
