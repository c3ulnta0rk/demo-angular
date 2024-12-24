import { Component, inject } from '@angular/core';
import { C3OverlayService } from '../../modules/overlay/overlay.service';
import { MyDialogExampleComponent } from './my-dialog-example/my-dialog-example.component';
import { map } from 'rxjs';

@Component({
  selector: 'c3-overlay-example',
  imports: [],
  templateUrl: './overlay-example.component.html',
  styleUrl: './overlay-example.component.scss',
})
export class OverlayExampleComponent {
  private readonly overlayService = inject(C3OverlayService);

  openDialog() {
    const overlayRef = this.overlayService.open(MyDialogExampleComponent, {
      hasBackdrop: true,
      inputs: {
        someInput: 'Hello world',
      },
    });

    // On peut gérer la fermeture
    overlayRef.afterComponentRefMounted$
      .pipe(map((componentRef) => componentRef.instance))
      .subscribe(({ requestClose }) => {
        requestClose.subscribe(() => overlayRef.close());
      });
  }
}
