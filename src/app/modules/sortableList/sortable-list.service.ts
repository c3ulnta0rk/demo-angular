import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SortableListService {
  private draggedItem: any = null;
  private draggedIndex: number | null = null;

  setDraggedItem(item: any, index: number) {
    this.draggedItem = item;
    this.draggedIndex = index;
  }

  getDraggedItem() {
    return { item: this.draggedItem, index: this.draggedIndex };
  }
}