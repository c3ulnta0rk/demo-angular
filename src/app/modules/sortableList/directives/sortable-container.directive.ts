
import { Directive, ElementRef, OnInit, inject } from '@angular/core';
import { SortableService } from '../sortable.service';

@Directive({
  selector: '[sortableContainer]',
  standalone: false
})
export class SortableContainerDirective implements OnInit {
  public readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly sortableService = inject(SortableService);

  ngOnInit(): void {
    this.sortableService.setContainer(this);
  }
}
