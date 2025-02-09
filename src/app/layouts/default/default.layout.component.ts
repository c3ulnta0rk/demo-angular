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
  public readonly childRoutes = signal([
    { path: 'dd-example', data: { title: 'Dropdown Example' } },
    { path: 'encapsulation-example', data: { title: 'Encapsulation Example' } },
    { path: 'auto-scroll', data: { title: 'Auto-scroll Example' } },
    { path: 'watch-sample', data: { title: 'Watch Example' } },
    { path: 'template-ref-sample', data: { title: 'Template Ref Example' } },
    { path: 'animation-example', data: { title: 'Animation Example' } },
    { path: 'rotation-example', data: { title: 'Rotation Example' } }
  ]);

  public readonly activePageTitle = signal('');
  public isCollapsed = signal(false);

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}