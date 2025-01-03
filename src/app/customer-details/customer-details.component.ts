import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeComponent } from '../password-change/password-change.component';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent {
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