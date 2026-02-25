import { Routes } from '@angular/router'; 

export const routes: Routes = [ 
  {
    path: '',
    loadComponent: () =>
    import('./layouts/home-layout/home-layout').then(m => m.HomeLayout),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/home/home.routes').then(m => m.HOME_ROUTES)
      },
    ]
  },  

  //DEFAULT 
  { path: '**', redirectTo: '' }
];
