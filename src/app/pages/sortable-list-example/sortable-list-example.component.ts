
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableListModule } from '../../modules/sortableList/sortable-list.module';

@Component({
  selector: 'app-sortable-list-example',
  standalone: true,
  imports: [CommonModule, SortableListModule],
  templateUrl: './sortable-list-example.component.html',
  styleUrls: ['./sortable-list-example.component.scss']
})
export class SortableListExampleComponent {
  items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ];
}
