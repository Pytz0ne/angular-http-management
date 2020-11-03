import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const AppRoutes: Routes = [
  { path: '', component: AppComponent, pathMatch: 'full' }
];

export const AppRoutingModule = RouterModule.forRoot(AppRoutes);
