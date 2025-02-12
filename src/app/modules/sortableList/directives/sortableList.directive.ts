import { Directive, HostListener, inject, model } from "@angular/core";
import { SortableListService } from "../sortable-list.service";

@Directive({
  selector: '[sortableList]',
  standalone: false,
})
export class SortableListDirective<T> {
  public readonly items = model<T[]>([]);

  private readonly sortableListService = inject(SortableListService)

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const { item, index: fromIndex } = this.sortableListService.getDraggedItem();
    const toIndex = Array.from((event.currentTarget as any).children).indexOf(event.target as HTMLElement);
    if (fromIndex !== null && toIndex >= 0) {
      this.reorderItems(fromIndex, toIndex);
    }
  }

  private reorderItems(fromIndex: number, toIndex: number) {
    if (fromIndex !== toIndex) {
      const item = this.items().splice(fromIndex, 1)[0];
      this.items().splice(toIndex, 0, item);
      this.items.set([...this.items()]);
    }
  }
}