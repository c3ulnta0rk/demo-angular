import { Component, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
selector: 'c3-template-dropdown',
  standalone: false,
  templateUrl: './template-dropdown.component.html',
  styleUrl: './template-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C3TemplateDropdownComponent {
  public readonly templateRef = viewChild('internalTemplate', {
    read: TemplateRef,
  });
}
