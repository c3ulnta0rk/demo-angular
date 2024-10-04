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
import { ExampleRotationComponent } from './pages/example-rotation/example-rotation.component';
import { DragDropExampleComponent } from './pages/drag-drop-example/drag-drop-example.component';
import { MenuCoulantPage } from './pages/menu-coulant/menu-coulant.component';
import { ButtonUnderlineComponent } from './pages/button-underline/button-underline.component';

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
        data: {
          title: 'Home',
        },
      },
      {
        path: 'dd-example',
        component: DdExampleComponent,
        data: {
          title: 'Dropdown',
        },
      },
      {
        path: 'encapsulation-example',
        component: EncapsulationExampleComponent,
        data: {
          title: 'Encapsulation',
        },
      },
      {
        path: 'auto-scroll',
        component: AutoScrollComponent,
        data: {
          title: 'Autocomplete / AutoScroll',
        },
      },
      {
        path: 'watch-sample',
        component: WatchSampleComponent,
        data: {
          title: 'C3 Watch',
        },
      },
      {
        path: 'template-ref-sample',
        component: TemplateRefComponent,
        data: {
          title: 'Template Ref',
        },
      },
      {
        path: 'animation-example',
        component: AnimationExampleComponent,
        data: {
          title: 'Animation (work in progress)',
        },
      },
      {
        path: 'rotation-example',
        component: ExampleRotationComponent,
        data: {
          title: 'Rotation Text',
        },
      },
      {
        path: 'drag-and-drop',
        component: DragDropExampleComponent,
        data: {
          title: 'Drag Drop w Inertia',
        },
      },
      {
        path: 'menu-coulant',
        component: MenuCoulantPage,
        data: {
          title: 'Menu Coulant',
        },
      },
      {
        path: 'button-underline',
        component: ButtonUnderlineComponent,
        data: {
          title: 'Bouton underline',
        },
      },
      { path: '**', redirectTo: '/home' },
    ],
  },
];
