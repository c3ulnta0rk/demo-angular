
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableListModule } from '../../modules/sortableList/sortable-list.module';

@Component({
  selector: 'app-sortable-example',
  templateUrl: './sortable-example.component.html',
  styleUrls: ['./sortable-example.component.scss'],
  standalone: true,
  imports: [CommonModule, SortableListModule]
})
export class SortableExampleComponent {
  items = [
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' },
    { id: 5, text: 'Item 5' }
  ];
}
