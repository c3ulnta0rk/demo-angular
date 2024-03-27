import { isPlatformServer } from '@angular/common';
import {
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  PLATFORM_ID,
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

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private _platformId: Object,
  ) {
    if (isPlatformServer(this._platformId)) return;

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

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    if (this.lastX === clientX && this.lastY === clientY) return;

    const deltaX = clientX - this.lastX;
    const deltaY = clientY - this.lastY;
    this.lastX = clientX;
    this.lastY = clientY;

    this.c3OnDrag.emit({ deltaX, deltaY });
  }
}
