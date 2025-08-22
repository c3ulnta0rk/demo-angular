import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  OnDestroy,
  DestroyRef,
} from '@angular/core';
import { NavigationEnd, Route, Router, RouterModule } from '@angular/router';

import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterModule, ToolbarComponent],
  templateUrl: './default.layout.component.html',
  styleUrl: './default.layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultLayoutComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public readonly childRoutes = signal<Route[]>([]);
  public readonly activePageTitle = signal('');
  public readonly isCollapsed = signal(false);

  private navigationListener: any = null;

  constructor() {
    this.initializeRoutes();
    this.setupNavigationListener();
    this.updatePageTitle();

    this.destroyRef.onDestroy(() => this.ngOnDestroy());
  }

  private initializeRoutes(): void {
    const currentRoute = this.router.config.find(
      (route) => route.component === DefaultLayoutComponent
    );
    if (currentRoute && currentRoute.children) {
      this.childRoutes.set(
        currentRoute.children.filter((route) => !route.redirectTo)
      );
    }
  }

  private setupNavigationListener(): void {
    this.navigationListener = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationListener) {
      this.navigationListener.unsubscribe();
    }
  }

  private updatePageTitle(): void {
    try {
      let route = this.router.routerState.root;
      while (route.firstChild) {
        route = route.firstChild;
      }

      // Vérifier que route.snapshot et route.snapshot.data existent
      if (route?.snapshot?.data && typeof route.snapshot.data === 'object') {
        const title =
          route.snapshot.data['title'] ||
          route.snapshot.url?.join('/') ||
          'Home';
        this.activePageTitle.set(title);
      } else {
        // Fallback si data n'est pas disponible
        const url = route?.snapshot?.url?.join('/') || 'Home';
        this.activePageTitle.set(url);
      }
    } catch (error) {
      // En cas d'erreur, utiliser une valeur par défaut
      console.warn('Error updating page title:', error);
      this.activePageTitle.set('Home');
    }
  }

  toggleSidebar(): void {
    this.isCollapsed.update((value) => !value);
  }
}
