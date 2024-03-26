import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { BehaviorSubject, bufferTime, filter, map, pipe } from 'rxjs';

@Directive({
  selector: '[c3OnDrag]',
  standalone: true,
})
export class C3OnDragDirective {
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private draggBuffer = new BehaviorSubject<{
    deltaX: number;
    deltaY: number;
  }>({
    deltaX: 0,
    deltaY: 0,
  });

  constructor() {
    this.draggBuffer
      .pipe(
        bufferTime(10),
        filter((value) => value.length > 0),
        map((value) => {
          return value.reduce((acc, curr) => {
            return {
              deltaX: acc.deltaX + curr.deltaX,
              deltaY: acc.deltaY + curr.deltaY,
            };
          });
        }),
        filter(
          (value) => Math.abs(value.deltaX) > 1 || Math.abs(value.deltaY) > 1
        )
      )
      .subscribe((value) => {
        this.c3OnDrag.emit(value);
      });
  }

  @Output() c3OnDrag = new EventEmitter<{
    deltaX: number;
    deltaY: number;
  }>();

  @HostListener('mousedown', ['$event'])
  onDragStart(event: DragEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: DragEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.draggBuffer.next({ deltaX, deltaY });
    }
  }
}
