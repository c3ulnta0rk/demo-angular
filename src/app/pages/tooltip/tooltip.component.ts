import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { C3TooltipDirective } from '../../directives/c3Tooltip.directive';

@Component({
  selector: 'c3-tooltip',
  standalone: true,
  imports: [C3TooltipDirective],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {}
