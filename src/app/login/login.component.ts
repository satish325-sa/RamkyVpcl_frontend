import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../customer/customer.service';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private router: Router,private customerservice:CustomerService) {}
  signin() {
    if (!this.username || !this.password) {
      alert('Username and password are required!');
      return;
    }
    
    const password = this.password;
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
    const loginData = {
      CUST_ID: this.username,
      PASSWORD: hashedPassword
    };
  
    this.customerservice.getlogin(loginData).subscribe(response => {
      console.log('Login response:', response); // Log the response for debugging
      
      // Ensure that response.data is checked and not just response
      if (response && response.data && response.data.length > 0) {
        const roleId = response.data[0].ROLEID; // Accessing ROLEID from data
        console.log('Role ID:', roleId); // Log roleId to check if it's correct
        const customerName = response.data[0].CUSTOMERNAME;
        const customerId = response.data[0].CUSTOMERID;
  
        // Store the customer data in the service
        this.customerservice.setCustomerData({ customerName, customerId });
  
        if (roleId === '1') {
          this.router.navigate(['/customer']);
        } else if (roleId === '2'||roleId === '3') {
          this.router.navigate(['/admin']);
        } else {
          console.error('Role not authorized or not recognized');
        }
      } else {
        console.error('Invalid login response or empty data');
      }
    }, error => {
      console.error('Login failed', error);
    });
  }
  
}
