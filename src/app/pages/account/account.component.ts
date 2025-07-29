import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from '../../shared/toastr/toastr.service';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  registerData = {
    name: '',
    email: '',
    password: ''
  };

  loginData = {
    email: '',
    password: ''
  };

  passwordRequirements = {
    length: false,
    lowerCase: false,
    upperCase: false,
    number: false,
    specialChar: false
  };

  passwordTouched = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService, 
    private toastr: ToastrService
  ) {}

  onRegisterSubmit() {
    this.apiService.post(`users`,this.registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        const toastId = this.toastr.success('¡Bienvenido, te deseamos una fructífera estancia!', 'Registro Correcto');
      },
      error: (error) => {
        //console.error('Error en el registro', error);
        //alert('Error en el registro: ' + (error.error?.message || 'Intente nuevamente'));
        //alert(error.error.message)
        if(error.error?.message[0] == "Invalid credentials"){
          error.error?.message[0] == "Credenciales incorrectas"
        }
        const toastId = this.toastr.error((error.error?.message[0] || 'Intente nuevamente'), 'Error en el registro');
      }
    });
  }

  onLoginSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
          //For debugging and development, copy the comments at the bottom
          const toastId = this.toastr.success('¡Te has logueado Exitosamente!', 'Logueado');
      },
      error: (error) => {
        //console.error('Error en el registro', error);
        //alert('Error en el registro: ' + (error.error?.message || 'Intente nuevamente'));
        const toastId = this.toastr.error((error.error?.message[0] || 'Intente nuevamente'), 'Error en el registro');
      }
    });
  }

  checkPasswordRequirements() {
    const pass = this.registerData.password;
    this.passwordRequirements = {
      length: pass?.length >= 8,
      lowerCase: /[a-z]/.test(pass),
      upperCase: /[A-Z]/.test(pass),
      number: /\d/.test(pass),
      specialChar: /[\W_]/.test(pass)
    };

    if (pass && pass.length > 0) {
      this.passwordTouched = true;
    } else {
      this.passwordTouched = false;
    }
  }
}





 // -- DEBUG AND STYLES DEVELOPMENT -- //
        // console.log('Registro exitoso', response);
        //  const toastId = this.toastr.info('¡Funciona correctamente!', 'Éxito');
        //  const toastId2 = this.toastr.error('¡Funciona correctamente!', 'Éxito');
        //  const toastId3 = this.toastr.warning('¡Funciona correctamente!', 'Éxito');
        //  const toastId4 = this.toastr.success('¡Funciona correctamente!', 'Éxito');
        //  setTimeout(() => this.toastr.remove(toastId!), 30000);
        //  setTimeout(() => this.toastr.remove(toastId2!), 30000);
        //  setTimeout(() => this.toastr.remove(toastId3!), 30000);
        //  setTimeout(() => this.toastr.remove(toastId4!), 30000);
         //alert(response.access_token);
        // -- DEBUG -- //