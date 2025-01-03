import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeComponent } from '../password-change/password-change.component';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.css'
})
export class CustomerRegisterComponent {
  constructor(private router: Router,private dialog: MatDialog) {}
  logout() {
    
    Swal.fire({
      title: 'Are you sure to logout?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  openPasswordChangeDialog() {
    this.dialog.open(PasswordChangeComponent, {
      width: '400px',  // Customize dialog width as needed
      data: {}  // Pass data to the dialog if necessary
    });
  } 
}
