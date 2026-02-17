import { Routes } from '@angular/router';
import { NotFound } from './common/components/not-found/not-found';  
import { adminGuard } from './core/guards/test.guard';

export const routes: Routes = [ 
  {
    path: '',
    loadComponent: () =>
    import('./layouts/home-layout/home-layout').then(m => m.HomeLayout),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.routes').then(m => m.HOME_ROUTES)
      },
    ]
  },  

  //DEFAULT 
  { path: '**', redirectTo: '' }
];
