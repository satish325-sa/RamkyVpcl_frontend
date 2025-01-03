import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'; 
import { CommonModule } from '@angular/common';



@Component({

  selector: 'app-password-change',
  standalone: true,
  imports: [
    
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,FormsModule,MatIconModule,CommonModule
  ],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  currentPasswordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(public dialogRef: MatDialogRef<PasswordChangeComponent>) {}
   // Function to toggle password visibility
   togglePasswordVisibility(field: string) {
    if (field === 'current') {
      this.currentPasswordVisible = !this.currentPasswordVisible;
    } else if (field === 'new') {
      this.newPasswordVisible = !this.newPasswordVisible;
    } else if (field === 'confirm') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  onSubmit(): void {
    // Here you would typically call a service to change the password
    console.log('Password change submitted');
    this.dialogRef.close(); // Close the modal on submit
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the modal on cancel
  }

}
