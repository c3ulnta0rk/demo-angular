import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-drag-drop-example',
  templateUrl: './drag-drop-example.component.html',
  styleUrls: ['./drag-drop-example.component.scss'],
})
export class DragDropExampleComponent implements AfterViewInit {
  @ViewChild('draggable') draggable: ElementRef;
  @ViewChildren('dropTarget') dropTargets: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.initDragAndDrop();
  }

  initDragAndDrop() {
    const draggable = this.draggable.nativeElement;
    let isDragging = false;
    let currentDropTarget: HTMLElement | null = null;
    let startX: number, startY: number;
    let lastX: number, lastY: number;

    draggable.addEventListener('mousedown', (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX - draggable.getBoundingClientRect().left;
      startY = e.clientY - draggable.getBoundingClientRect().top;
      draggable.style.position = 'absolute';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      lastX = e.clientX - startX;
      lastY = e.clientY - startY;

      draggable.style.left = `${lastX}px`;
      draggable.style.top = `${lastY}px`;

      const dropTarget = this.getDropTargetUnderPoint(e.clientX, e.clientY);

      if (dropTarget) {
        if (currentDropTarget && currentDropTarget !== dropTarget) {
          currentDropTarget.classList.remove('active');
        }
        dropTarget.classList.add('active');
        currentDropTarget = dropTarget;
      } else if (currentDropTarget) {
        currentDropTarget.classList.remove('active');
        currentDropTarget = null;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (currentDropTarget) {
        currentDropTarget.classList.remove('active');
        // Ici, vous pouvez ajouter la logique pour "déposer" l'élément
      }
    };
  }

  getDropTargetUnderPoint(x: number, y: number): HTMLElement | null {
    return this.dropTargets.reduce((closest, current) => {
      const box = current.nativeElement.getBoundingClientRect();
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
        return current.nativeElement;
      } else {
        return closest;
      }
    }, this.dropTargets.first.nativeElement);
  }

  pointDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
