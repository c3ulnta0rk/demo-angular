
import { Component, signal } from '@angular/core';

import { SortableListModule } from '../../modules/sortableList/sortable-list.module';

@Component({
  selector: 'app-sortable-example',
  templateUrl: './sortable-example.component.html',
  styleUrls: ['./sortable-example.component.scss'],
  standalone: true,
  imports: [SortableListModule]
})
export class SortableExampleComponent {
  public readonly items = signal([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' },
    { id: 5, text: 'Item 5' }
  ]);
}
