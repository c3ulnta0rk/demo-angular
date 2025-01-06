import { Component, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'c3-template-dropdown',
  standalone: false,
  templateUrl: './template-dropdown.component.html',
  styleUrl: './template-dropdown.component.scss',
})
export class C3TemplateDropdownComponent {
  public readonly templateRef = viewChild('internalTemplate', {
    read: TemplateRef,
  });
}
