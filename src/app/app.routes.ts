import { Routes } from '@angular/router';
import { DdExampleComponent } from './pages/dd-example/dd-example.component';
import { EncapsulationExampleComponent } from './pages/encapsulation-example/encapsulation-example.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { DefaultLayoutComponent } from './layouts/default/default.layout.component';
import { HomeLayoutComponent } from './layouts/home/home.layout.component';
import { AutoScrollComponent } from './pages/auto-scroll/auto-scroll.component';
import { WatchSampleComponent } from './pages/watch-sample/watch-sample.component';
import { TemplateRefComponent } from './pages/template-ref/template-ref.component';
import { AnimationExampleComponent } from './pages/animation-example/animation-example.component';

export const routes: Routes = [
  // {
  //   path: 'home',
  //   component: HomeLayoutComponent,
  //   children: [],
  // },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'dd-example',
        component: DdExampleComponent,
      },
      {
        path: 'encapsulation-example',
        component: EncapsulationExampleComponent,
      },
      {
        path: 'auto-scroll',
        component: AutoScrollComponent,
      },
      {
        path: 'watch-sample',
        component: WatchSampleComponent,
      },
      {
        path: 'template-ref-sample',
        component: TemplateRefComponent,
      },
      {
        path: 'animation-example',
        component: AnimationExampleComponent,
      },
      { path: '**', redirectTo: '/home' },
    ],
  },
];
