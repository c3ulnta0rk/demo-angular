import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
selector: 'c3-c3-sidebar-menu',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './c3-sidebar-menu.component.html',
  styleUrl: './c3-sidebar-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class C3SidebarMenuComponent { }
