import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Load Components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
  // DEFAULT
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path: 'signup',
    component:RegisterComponent
  },
  {
    path:'forgot-password',
    component:ForgetPasswordComponent
  },
  {
    path:'resetpassword/:email/:token',
    component:ForgetPasswordComponent
  },
  {
    path:'verify-email',
    component:VerifyEmailComponent
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
