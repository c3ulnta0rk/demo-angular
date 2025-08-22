import { Component, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { C3OverlayService } from '../../modules/overlay/overlay.service';
import { MyDialogExampleComponent } from './my-dialog-example/my-dialog-example.component';

@Component({
selector: 'c3-overlay-example',
  imports: [],
  templateUrl: './overlay-example.component.html',
  styleUrl: './overlay-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

    effect(() => {
      const componentRef = overlayRef.componentRefMounted();
      if (componentRef) {
        const { requestClose } = componentRef.instance;
        const closeSubscription = requestClose.subscribe(() => overlayRef.close());
      }
    });
  }
}
