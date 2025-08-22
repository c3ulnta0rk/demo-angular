import { Component, ChangeDetectionStrategy } from '@angular/core';

import { DragDropModule } from '../../modules/dragDrop/drag-drop.module';

@Component({
selector: 'app-drag-drop-example',
    imports: [DragDropModule],
    templateUrl: './drag-drop-example.component.html',
    styleUrls: ['./drag-drop-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragDropExampleComponent {
  dropZones = [1, 2, 3]; // Vous pouvez ajuster ce tableau si vous voulez plus ou moins de zones de drop
}
