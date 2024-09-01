import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DragDropService } from '../drag-drop.service';

@Directive({
  selector: '[dropzone]',
})
export class DropzoneDirective implements OnInit, OnDestroy {
  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private dragDropService = inject(DragDropService);

  ngOnInit() {
    this.dragDropService.addDropTarget(this.element);
  }

  ngOnDestroy() {
    this.dragDropService.removeDropTarget(this.element);
  }
}
