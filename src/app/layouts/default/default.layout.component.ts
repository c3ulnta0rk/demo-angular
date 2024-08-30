import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  RouterModule,
  Router,
  Route,
  NavigationEnd,
  Event,
} from '@angular/router';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'c3-default-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarComponent],
  templateUrl: './default.layout.component.html',
  styleUrl: './default.layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultLayoutComponent {
  private router = inject(Router);
  public childRoutes = signal<Route[]>([]);
  public activePageTitle = signal<string>('');
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
      .subscribe((event: Event) => {
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
}
