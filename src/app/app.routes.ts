import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DdExampleComponent } from './pages/home/pages/dd-example/dd-example.component';
import { EncapsulationExampleComponent } from './pages/home/pages/encapsulation-example/encapsulation-example.component';
import { HeaderStylePageComponent } from './pages/home/pages/header-style-page/header-style-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'dd-example',
        component: DdExampleComponent,
      },
      {
        path: 'encapsulation-example',
        component: EncapsulationExampleComponent,
      },
      {
        path: 'style-test',
        component: HeaderStylePageComponent,
      },
      {
        path: '',
        redirectTo: 'dd-example',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
