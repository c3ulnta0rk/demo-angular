import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UnderlineDirective } from '../../directives/underline.directive';

@Component({
  selector: 'c3-button-underline',
  standalone: true,
  imports: [CommonModule, UnderlineDirective],
  templateUrl: './button-underline.component.html',
  styleUrl: './button-underline.component.scss',
})
export class ButtonUnderlineComponent {}
