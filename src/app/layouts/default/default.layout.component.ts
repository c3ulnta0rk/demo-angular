import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarComponent],
  templateUrl: './default.layout.component.html',
  styleUrl: './default.layout.component.scss'
})
export class DefaultLayoutComponent {
  public readonly childRoutes = signal(routes[0].children?.filter(route => 
    route.path !== '**' && route.path !== 'home'
  ) || []);

  public readonly activePageTitle = signal('');
  public isCollapsed = signal(false);

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}