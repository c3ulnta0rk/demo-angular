import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  QueryList,
  ViewChildren,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-drag-drop-example',
  templateUrl: './drag-drop-example.component.html',
  styleUrls: ['./drag-drop-example.component.scss'],
})
export class DragDropExampleComponent implements AfterViewInit {
  @ViewChild('draggable') draggable: ElementRef;
  @ViewChildren('dropTarget') dropTargets: QueryList<ElementRef>;
  @ViewChild('container') container: ElementRef;

  private placeholder: HTMLElement;
  private animationFrameId: number;

  constructor(private renderer: Renderer2) {}

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
      this.createPlaceholder(draggable);
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
        this.movePlaceholderToDropTarget(dropTarget);
      } else if (currentDropTarget) {
        currentDropTarget.classList.remove('active');
        currentDropTarget = null;
        this.resetPlaceholder();
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
      this.removePlaceholder();
      draggable.style.position = 'static';
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

  createPlaceholder(draggable: HTMLElement) {
    this.placeholder = this.renderer.createElement('div');
    this.renderer.addClass(this.placeholder, 'placeholder');
    const { width, height } = draggable.getBoundingClientRect();
    this.renderer.setStyle(this.placeholder, 'width', `${width}px`);
    this.renderer.setStyle(this.placeholder, 'height', `${height}px`);
    this.renderer.insertBefore(
      draggable.parentNode,
      this.placeholder,
      draggable
    );
  }

  movePlaceholderToDropTarget(dropTarget: HTMLElement) {
    const targetRect = dropTarget.getBoundingClientRect();
    const placeholderRect = this.placeholder.getBoundingClientRect();

    const targetX =
      targetRect.left + (targetRect.width - placeholderRect.width) / 2;
    const targetY =
      targetRect.top + (targetRect.height - placeholderRect.height) / 2;

    this.animatePlaceholder(targetX, targetY);
  }

  animatePlaceholder(targetX: number, targetY: number) {
    const { x, y } = this.placeholder.getBoundingClientRect();
    const startX = parseFloat(this.placeholder.style.left) || x;
    const startY = parseFloat(this.placeholder.style.top) || y;
    const startTime = performance.now();
    const duration = 300; // Durée de l'animation en millisecondes

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = this.easeOutCubic(progress);

      const currentX = startX + (targetX - startX) * easeProgress;
      const currentY = startY + (targetY - startY) * easeProgress;

      this.renderer.setStyle(this.placeholder, 'left', `${currentX}px`);
      this.renderer.setStyle(this.placeholder, 'top', `${currentY}px`);

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationFrameId = requestAnimationFrame(animate);
  }

  easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  resetPlaceholder() {
    // Annuler l'animation en cours si elle existe
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const initialPosition =
      this.draggable.nativeElement.getBoundingClientRect();
    this.animatePlaceholder(initialPosition.left, initialPosition.top);
  }

  removePlaceholder() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.placeholder && this.placeholder.parentNode) {
      this.renderer.removeChild(this.placeholder.parentNode, this.placeholder);
    }
  }
}
