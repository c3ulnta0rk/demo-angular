import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class AppComponent {}
