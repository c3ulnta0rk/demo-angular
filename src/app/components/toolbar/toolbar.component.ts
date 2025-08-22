
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'c3-toolbar',
    imports: [],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'c3-toolbar',
    }
})
export class ToolbarComponent {}
