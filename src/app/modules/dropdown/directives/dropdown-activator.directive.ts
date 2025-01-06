import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  input,
} from '@angular/core';
import { C3TemplateDropdownComponent } from '../template-dropdown/template-dropdown.component';
import { C3DropdownService } from '../dropdown.service';

@Directive({
  selector: '[c3DropdownActivator]',
  standalone: false,
  host: {
    '(click)': 'onClick()',
  },
})
export class DropdownActivatorDirective {
  public readonly activator = input<C3TemplateDropdownComponent>(null, {
    alias: 'c3DropdownActivator',
  });

  private readonly _dropdown = inject(C3DropdownService);
  private readonly _elementRef = inject(ElementRef);

  private onClick() {
    if (!this.activator()) return;

    this._dropdown.open({
      element: this._elementRef.nativeElement,
      templateRef: this.activator().templateRef(),
      position: 'auto',
      closeOnOutsideClick: true
    });
  }
}
