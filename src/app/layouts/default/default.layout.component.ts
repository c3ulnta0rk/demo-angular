import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Route, Router, RouterModule } from '@angular/router';

import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterModule, ToolbarComponent],
  templateUrl: './default.layout.component.html',
  styleUrl: './default.layout.component.scss'
})
export class DefaultLayoutComponent {
  private router = inject(Router);
  public readonly childRoutes = signal<Route[]>([]);

  public readonly activePageTitle = signal('');
  public isCollapsed = signal(false);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    const currentRoute = this.router.config.find(
      (route) => route.component === DefaultLayoutComponent
    );
    if (currentRoute && currentRoute.children) {
      this.childRoutes.set(
        currentRoute.children.filter((route) => !route.redirectTo)
      );
    }

    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updatePageTitle();
        }
      });

    // Initial title update
    this.updatePageTitle();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePageTitle() {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const title =
      route.snapshot.data['title'] || route.snapshot.url.join('/') || 'Home';
    this.activePageTitle.set(title);
  }

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }
}