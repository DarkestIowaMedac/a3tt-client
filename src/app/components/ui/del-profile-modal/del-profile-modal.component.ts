import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-del-profile-modal',
  standalone: false,
  templateUrl: './del-profile-modal.component.html',
  styleUrls: ['./del-profile-modal.component.scss']
})
export class DelProfileModalComponent {
  email: string = '';
  password: string = '';
  isSubmitting = false;
  isVisible = true;
  errorMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<DelProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentEmail: string }
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu email y contraseña';
      return;
    }

    if (this.email !== this.data.currentEmail) {
      this.errorMessage = 'El email no coincide con tu cuenta';
      return;
    }

    const confirmDelete = confirm('¿Estás absolutamente seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmDelete) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = null;
    this.isSubmitting = true;
    const deleteData: any = {};
    
    deleteData.email = this.email;
    deleteData.password = this.password;

    this.authService.login(deleteData, false).subscribe({
      next: () => {
        // Si las credenciales son correctas, procedemos a borrar
        this.apiService.deleteWithBody('users/me', deleteData).subscribe({
          next: () => {
            this.dialogRef.close({ 
            success: true,
            message: 'Cuenta eliminada permanentemente' 
            });
          },
          error: (err) => {
            this.handleError(err, 'Error al eliminar la cuenta');
          }
        });
      },
      error: (err) => {
        this.handleError(err, 'Credenciales incorrectas');
      }
    });
  }

   private handleError(error: any, defaultMessage: string): void {
    this.isSubmitting = false;
    console.error('Error:', error);
    
    // Manejo específico de errores HTTP
    if (error.status === 0) {
      this.errorMessage = 'Error de conexión. Verifica tu conexión a internet';
    } else if (error.status === 401) {
      this.errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña';
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = defaultMessage;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}