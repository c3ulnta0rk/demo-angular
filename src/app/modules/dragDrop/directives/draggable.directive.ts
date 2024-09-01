import {
  Directive,
  ElementRef,
  inject,
  effect,
  HostListener,
} from '@angular/core';
import { DragDropService } from '../drag-drop.service';

@Directive({
  selector: '[draggable]',
})
export class DraggableDirective {
  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private dragDropService = inject(DragDropService);
  private startX: number;
  private startY: number;

  constructor() {
    effect(() => {
      if (this.dragDropService.isDragging()) {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
      } else {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
      }
    });
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    const rect = this.element.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
    this.dragDropService.setDraggingElement(this.element);
    this.createPlaceholder();
  }

  private createPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.width = `${this.element.offsetWidth}px`;
    placeholder.style.height = `${this.element.offsetHeight}px`;
    const rect = this.element.getBoundingClientRect();
    placeholder.style.left = `${rect.left}px`;
    placeholder.style.top = `${rect.top}px`;
    document.body.appendChild(placeholder);
    this.dragDropService.setPlaceholder(placeholder);
  }

  private onMouseMove = (event: MouseEvent) => {
    const x = event.clientX - this.startX;
    const y = event.clientY - this.startY;
    this.element.style.position = 'fixed';
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    const dropTarget = this.dragDropService.getDropTargetUnderPoint(
      event.clientX,
      event.clientY
    );
    if (dropTarget) {
      this.dragDropService.currentDropTarget.set(dropTarget);
      this.movePlaceholderToDropTarget(dropTarget);
    } else {
      this.dragDropService.currentDropTarget.set(null);
      this.resetPlaceholder();
    }
  };

  private onMouseUp = () => {
    this.dragDropService.setDraggingElement(null);
    this.element.style.position = '';
    this.element.style.left = '';
    this.element.style.top = '';
    this.removePlaceholder();
  };

  private movePlaceholderToDropTarget(dropTarget: HTMLElement) {
    const placeholder = this.dragDropService.getPlaceholder();
    if (!placeholder) return;

    const targetRect = dropTarget.getBoundingClientRect();
    const placeholderRect = placeholder.getBoundingClientRect();

    const targetX =
      targetRect.left + (targetRect.width - placeholderRect.width) / 2;
    const targetY =
      targetRect.top + (targetRect.height - placeholderRect.height) / 2;

    this.animatePlaceholder(placeholder, targetX, targetY);
  }

  private resetPlaceholder() {
    const placeholder = this.dragDropService.getPlaceholder();
    if (!placeholder) return;

    const initialPosition = this.element.getBoundingClientRect();
    this.animatePlaceholder(
      placeholder,
      initialPosition.left,
      initialPosition.top
    );
  }

  private animatePlaceholder(
    placeholder: HTMLElement,
    targetX: number,
    targetY: number
  ) {
    const startX =
      parseFloat(placeholder.style.left) ||
      placeholder.getBoundingClientRect().left;
    const startY =
      parseFloat(placeholder.style.top) ||
      placeholder.getBoundingClientRect().top;
    const startTime = performance.now();
    const duration = 300;

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (targetX - startX) * easeProgress;
      const currentY = startY + (targetY - startY) * easeProgress;

      placeholder.style.left = `${currentX}px`;
      placeholder.style.top = `${currentY}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private removePlaceholder() {
    const placeholder = this.dragDropService.getPlaceholder();
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }
    this.dragDropService.setPlaceholder(null);
  }
}
