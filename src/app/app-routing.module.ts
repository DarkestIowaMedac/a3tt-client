import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { AccountComponent } from './pages/account/account.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';
import { AuthService } from './shared/services/auth.service';
import { IncomingFeaturesComponent } from './pages/incoming-features/incoming-features.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { guestGuard } from './shared/guards/GuestGuard';
import { authGuard } from './shared/guards/AuthGuard';

const routes: Routes = [

  //Rutas de invitado
  { 
    path: 'home',
    component: HomeComponent,
    canActivate: [guestGuard] 
  },
  { path: 'incomingFeatures', 
    component: IncomingFeaturesComponent, 
    canActivate: [guestGuard]
  },
  {
    path: 'login',
    component: AccountComponent,
    canActivate: [guestGuard]
  },
  
  //Rutas de usuario logueado
  { 
    path: 'tutorial',
    component: TutorialComponent,
    canActivate: [authGuard] 
  },
  { path: 'tasks', 
    component: TasksComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
