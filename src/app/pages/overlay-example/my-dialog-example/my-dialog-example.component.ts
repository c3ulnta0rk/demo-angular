import { Component, input, output } from '@angular/core';

@Component({
    selector: 'c3-my-dialog-example',
    imports: [],
    templateUrl: './my-dialog-example.component.html',
    styleUrl: './my-dialog-example.component.scss',
    host: {
        class: 'c3-my-dialog-example c3-card shadow',
    },
})
export class MyDialogExampleComponent {
    public readonly someInput = input<string>('');
    public readonly requestClose = output<void>();

    closeDialog() {
        // Fermeture du dialog
        this.requestClose.emit();
    }
}
