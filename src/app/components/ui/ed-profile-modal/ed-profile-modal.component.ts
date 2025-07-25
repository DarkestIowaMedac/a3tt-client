import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: false,
  templateUrl: './ed-profile-modal.component.html',
  styleUrls: ['./ed-profile-modal.component.scss']
})
export class EdProfileModalComponent {
  name: string = '';
  newPassword: string = '';
  isSubmitting = false;
  isVisible = true;
  passwordTouched = false;

  // Variables para los requisitos de contraseña
  reqLength = false;
  reqLowerCase = false;
  reqUpperCase = false;
  reqNumber = false;
  reqSpecialChar = false;

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<EdProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentName: string }
  ) {
    this.name = data.currentName;
  }

  checkPasswordRequirements(): void {
    const password = this.newPassword;
    this.reqLength = password?.length >= 8;
    this.reqLowerCase = /[a-z]/.test(password);
    this.reqUpperCase = /[A-Z]/.test(password);
    this.reqNumber = /\d/.test(password);
    this.reqSpecialChar = /[\W_]/.test(password);
    this.passwordTouched = !!password && password.length > 0;
  }

  get passwordValid(): boolean {
    if (!this.newPassword) return true;
    return this.reqLength && this.reqLowerCase && this.reqUpperCase && 
           this.reqNumber && this.reqSpecialChar;
  }

  get formValid(): boolean {
    return (this.name.length >= 3 || this.newPassword.length >= 8) && 
           (this.newPassword ? this.passwordValid : true);
  }

  onSubmit(): void {
    if (!this.formValid) return;

    this.isSubmitting = true;
    const updateData: any = {};
    
    if (this.name && this.name !== this.data.currentName) {
      updateData.name = this.name;
    }
    
    if (this.newPassword) {
      updateData.password = this.newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      this.dialogRef.close();
      return;
    }

    this.apiService.patch('users/me', updateData).subscribe({
      next: () => {
        this.dialogRef.close({ success: true, name: updateData.name || this.data.currentName });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error updating profile:', err);
        alert('Error updating profile: ' + (err.error?.message || 'Please try again'));
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}