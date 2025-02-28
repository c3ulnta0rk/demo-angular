import { Directive } from "@angular/core";

@Directive({
  selector: "[sortableList]",
  standalone: false,
})
export class SortableListDirective<T> {}
