import { Injectable, signal, computed } from "@angular/core";

@Injectable({
  providedIn: "root",
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
    let closestTarget: HTMLElement | null = null;
    let closestDistance = Infinity;

    for (const target of this.dropTargets()) {
      const box = target.getBoundingClientRect();

      //Vérifie si le point est dans la cible
      if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) {
        const distance = this.pointDistance(
          x,
          y,
          box.left + box.width / 2,
          box.top + box.height / 2,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestTarget = target;
        }
      }
    }

    return closestTarget;
  }

  private pointDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  drop() {
    if (this.draggingElement() && this.currentDropTarget()) {
      this.currentDropTarget()!.appendChild(this.draggingElement()!); // Insère l'élément DANS la cible
      // this.currentDropTarget().parentNode!.insertBefore(this.draggingElement(), this.currentDropTarget()); // Insère AVANT la cible. Choisissez la bonne méthode!
    }
    this.draggingElement.set(null);
    this.currentDropTarget.set(null);
  }
}
