import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { AdminComponent } from './admin/admin.component';
import { CustomerRegisterComponent } from './customer-register/customer-register.component';
import { SubcustomerDetailsComponent } from './subcustomer-details/subcustomer-details.component';
import { TankMasterComponent } from './tank-master/tank-master.component';

export const routes: Routes = [
    { path: 'login', component:LoginComponent },
    { path: 'customer', component:CustomerComponent },
    { path: 'admin', component:AdminComponent },
    {path:'customerregister',component:CustomerRegisterComponent},
    {path:'subcustomerdetails',component:SubcustomerDetailsComponent},
    {path:'tankmaster',component:TankMasterComponent},
    { path: '**', redirectTo: '/login' }

];
