import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '../../modules/dragDrop/drag-drop.module';

@Component({
  selector: 'app-drag-drop-example',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './drag-drop-example.component.html',
  styleUrls: ['./drag-drop-example.component.scss'],
})
export class DragDropExampleComponent {
  dropZones = [1, 2, 3]; // Vous pouvez ajuster ce tableau si vous voulez plus ou moins de zones de drop
}
