import { Directive, ElementRef, HostListener, inject, Renderer2 } from "@angular/core";
import { SortableListService } from "../sortable-list.service";

@Directive({
  selector: '[draggableItem]',
  standalone: false,
})
export class DraggableDirective {
  private readonly elenment = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly sortableListService = inject(SortableListService);

  constructor() {
    this.renderer.setAttribute(this.elenment.nativeElement, "draggable", "true");
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    const index = Array.from(this.elenment.nativeElement.parentNode.children).indexOf(this.elenment.nativeElement);
    this.sortableListService.setDraggedItem(this.elenment.nativeElement.innerText, index);
    event.dataTransfer!.effectAllowed = 'move';
  }
}