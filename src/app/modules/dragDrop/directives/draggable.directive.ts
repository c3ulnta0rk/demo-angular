import {
  Directive,
  ElementRef,
  inject,
  effect,
  HostListener,
  PLATFORM_ID,
} from "@angular/core";
import { DragDropService } from "../drag-drop.service";
import { isPlatformBrowser } from "@angular/common";

@Directive({
  selector: "[draggable]",
  standalone: false,
})
export class DraggableDirective {
  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private dragDropService = inject(DragDropService);
  private platformId = inject(PLATFORM_ID);
  private startX: number;
  private startY: number;
  private initialPlaceholderLeft: number;
  private initialPlaceholderTop: number;
  private previousDropTarget: HTMLElement | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId))
      effect(() => {
        if (this.dragDropService.isDragging()) {
          document.addEventListener("mousemove", this.onMouseMove);
          document.addEventListener("mouseup", this.onMouseUp);
        } else {
          document.removeEventListener("mousemove", this.onMouseMove);
          document.removeEventListener("mouseup", this.onMouseUp);
        }
      });
  }

  @HostListener("mousedown", ["$event"])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    const rect = this.element.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
    this.dragDropService.setDraggingElement(this.element);
    this.createPlaceholder();
  }

  private createPlaceholder() {
    const placeholder = document.createElement("div");
    placeholder.classList.add("placeholder");
    placeholder.style.width = `${this.element.offsetWidth}px`;
    placeholder.style.height = `${this.element.offsetHeight}px`;
    const rect = this.element.getBoundingClientRect();
    placeholder.style.left = `${rect.left}px`;
    placeholder.style.top = `${rect.top}px`;

    this.initialPlaceholderLeft = rect.left;
    this.initialPlaceholderTop = rect.top;

    document.body.appendChild(placeholder);
    this.dragDropService.setPlaceholder(placeholder);
  }

  private onMouseMove = (event: MouseEvent) => {
    const x = event.clientX - this.startX;
    const y = event.clientY - this.startY;
    this.element.style.position = "fixed";
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    const dropTarget = this.dragDropService.getDropTargetUnderPoint(
      event.clientX,
      event.clientY,
    );

    if (dropTarget) {
      this.dragDropService.currentDropTarget.set(dropTarget);
      if (dropTarget !== this.previousDropTarget) {
        this.movePlaceholderToDropTarget(dropTarget);
        this.previousDropTarget = dropTarget;
      }
    } else if (!this.previousDropTarget) this.resetPlaceholder();
  };

  private onMouseUp = () => {
    this.dragDropService.drop();
    this.dragDropService.setDraggingElement(null);
    this.element.style.position = "";
    this.element.style.left = "";
    this.element.style.top = "";
    this.removePlaceholder();
    this.previousDropTarget = null;
  };

  private async movePlaceholderToDropTarget(dropTarget: HTMLElement) {
    const placeholder = this.dragDropService.getPlaceholder();
    if (!placeholder) return;

    const targetRect = dropTarget.getBoundingClientRect();

    await this.animatePlaceholder(placeholder, targetRect.left, targetRect.top);
    dropTarget.parentNode?.insertBefore(placeholder, dropTarget);
  }

  private animatePlaceholder(
    placeholder: HTMLElement,
    targetX: number,
    targetY: number,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const startX = placeholder.getBoundingClientRect().left;
      const startY = placeholder.getBoundingClientRect().top;
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
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  private resetPlaceholder() {
    const placeholder = this.dragDropService.getPlaceholder();
    if (!placeholder) return;

    if (placeholder.parentNode && this.element.parentNode) {
      this.element.parentNode.insertBefore(placeholder, this.element);
    }
  }

  private removePlaceholder() {
    const placeholder = this.dragDropService.getPlaceholder();
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }
    this.dragDropService.setPlaceholder(null);
  }
}
