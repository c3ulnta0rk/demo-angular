
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'c3-card',
    imports: [],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'c3-card',
    }
})
export class C3CardComponent {}
