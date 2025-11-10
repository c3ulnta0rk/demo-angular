import { Component, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragContainerDirective } from '../../directives/drag-container.directive';
import { DragItemDirective } from '../../directives/drag-item.directive';

@Component({
  selector: 'c3-drag-training',
  imports: [CommonModule, DragContainerDirective, DragItemDirective],
  templateUrl: './drag-training.component.html',
  styleUrl: './drag-training.component.scss',
})
export class DragTrainingComponent {}
