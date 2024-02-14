import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'bands'},
    {path: 'bands', loadChildren: () => import('./modules/brands/list/list.module').then(m => m.BandListModule)},
    {path: 'bands/:id', loadChildren: () => import('./modules/brands/band/band.module').then(m => m.BandModule)}
];
