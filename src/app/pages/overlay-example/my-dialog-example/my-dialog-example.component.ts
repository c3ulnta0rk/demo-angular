import { Component, input } from '@angular/core';

@Component({
  selector: 'c3-my-dialog-example',
  standalone: true,
  imports: [],
  templateUrl: './my-dialog-example.component.html',
  styleUrl: './my-dialog-example.component.scss',
  host: {
    class: 'c3-my-dialog-example c3-card'
  }
})
export class MyDialogExampleComponent {
  public readonly someInput = input<string>('');

  closeDialog() {
    // Fermeture du dialog
  }
}
