import { Directive, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { DragCoordinatorService } from './drag-coordinator.service';

@Directive({
  selector: '[c3DragContainer]',
  standalone: true,
  providers: [DragCoordinatorService],
})
export class DragContainerDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly coordinator = inject(DragCoordinatorService);

  ngOnInit(): void {
    this.coordinator.setContainer(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.coordinator.setContainer(null);
  }
}
