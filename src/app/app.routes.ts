import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientListComponent } from './components/clients/client-list/client-list.component';
import { ClientFormComponent } from './components/clients/client-form/client-form.component';
import { AccountListComponent } from './components/accounts/account-list/account-list.component';
import { AccountFormComponent } from './components/accounts/account-form/account-form.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transactions/transaction-form/transaction-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    component: ClientListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/new',
    component: ClientFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/edit/:id',
    component: ClientFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accounts',
    component: AccountListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accounts/new',
    component: AccountFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    component: TransactionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions/new',
    component: TransactionFormComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
