import {
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[c3OnDrag]',
  standalone: true,
})
export class C3OnDragDirective {
  @Output() c3OnDrag = new EventEmitter<{ deltaX: number; deltaY: number }>();
  @Output() onDragStart = new EventEmitter<void>();
  @Output() onDragEnd = new EventEmitter<void>();

  private isDragging = false;
  private lastX: number;
  private lastY: number;
  private _destroyRef = inject(DestroyRef);

  constructor(private elementRef: ElementRef) {
    this.registerEvent('mousedown', this.onMouseDown.bind(this));
    this.registerEvent('touchstart', this.onTouchStart.bind(this));
    this.registerEvent('mouseup', this.onMouseUp.bind(this), window);
    this.registerEvent('touchend', this.onTouchEnd.bind(this));
    this.registerEvent('mousemove', this.onMouseMove.bind(this));
    this.registerEvent('touchmove', this.onTouchMove.bind(this));
  }

  private registerEvent(
    eventName: string,
    eventHandler: (event: Event) => void,
    element: HTMLElement | Window = this.elementRef.nativeElement,
  ): void {
    fromEvent(element, eventName)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(eventHandler);
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.startDrag(event);
  }

  private onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.startDrag(event);
  }

  private onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.endDrag(event);
  }

  private onTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.endDrag(event);
  }

  private onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.drag(event);
  }

  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.drag(event);
  }

  private startDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.lastX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.lastY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  }

  private endDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = false;
    this.onDragEnd.emit();
  }

  private drag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;

    let deltaX = 0;
    let deltaY = 0;

    if (event instanceof MouseEvent) {
      deltaX = event.clientX - this.lastX;
      deltaY = event.clientY - this.lastY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    } else if (event instanceof TouchEvent) {
      deltaX = event.touches[0].clientX - this.lastX;
      deltaY = event.touches[0].clientY - this.lastY;
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
    }

    this.c3OnDrag.emit({ deltaX, deltaY });
  }
}
