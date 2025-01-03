import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule,MatFormField,MatLabel,MatInputModule,RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor() {}

  // Handle form submission
  onSubmit() {
    if (this.email) {
      // Replace the following line with your logic for sending the reset link
      console.log('Sending reset link to:', this.email);
      // You might call an API to handle the email submission

      // Optionally reset the email field or display a success message
      this.email = ''; // Reset the input field
    }
  }

  // Handle cancel action
  onCancel() {
    // Optionally reset the email field or navigate to another page
    this.email = ''; // Reset the input field
    console.log('Forgot password process canceled');
  }

}
