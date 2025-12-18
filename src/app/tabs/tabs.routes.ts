import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./clients/clients.page').then((m) => m.ClientsPage),
      },
      {
        path: 'items',
        loadComponent: () =>
          import('./items/items.page').then((m) => m.ItemsPage),
      },
      {
        path: 'sale-details/:id',
        loadComponent: () =>
          import('./dashboard/sale-details.page').then((m) => m.SaleDetailsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
