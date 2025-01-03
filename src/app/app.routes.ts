import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { AdminComponent } from './admin/admin.component';
import { CustomerRegisterComponent } from './customer-register/customer-register.component';
import { SubcustomerDetailsComponent } from './subcustomer-details/subcustomer-details.component';
import { TankMasterComponent } from './tank-master/tank-master.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { AdminRegisterComponent } from './admin-register/admin-register.component';

export const routes: Routes = [
    { path: 'login', component:LoginComponent },
    { path: 'customer', component:CustomerComponent },
    { path: 'admin', component:AdminComponent },
    {path:'customerregister',component:CustomerRegisterComponent},
    {path:'subcustomerdetails',component:SubcustomerDetailsComponent},
    {path:'tankmaster',component:TankMasterComponent},
    {path:'passwordchange',component:PasswordChangeComponent},
    {path:'forgotpassword',component:ForgotPasswordComponent},
    {path:'customerdetails',component:CustomerDetailsComponent},
    {path:'adminregister',component:AdminRegisterComponent},
    { path: '**', redirectTo: '/login' }

];
