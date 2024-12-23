import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { C3OnClickOutsideDirective } from '../../modules/onClickOutside/onClickOutside.directive';

@Component({
    selector: 'c3-sample',
    imports: [CommonModule, C3OnClickOutsideDirective],
    templateUrl: './sample.component.html',
    styleUrl: './sample.component.scss'
})
export class SampleComponent {
  @Input() public txt: string = 'Sample Component';

  clickOutside($event: any) {
    // console.log('clickOutside', $event);
  }
}
