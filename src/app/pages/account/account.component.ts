import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';

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

  constructor(
    private apiService: ApiService,
    private authService: AuthService, 
  ) {}

  onRegisterSubmit() {
    this.apiService.post(`users`,this.registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        alert('¡Registro exitoso!');
      },
      error: (error) => {
        console.error('Error en el registro', error);
        alert('Error en el registro: ' + (error.error?.message || 'Intente nuevamente'));
      }
    });
  }

  onLoginSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        alert(response.access_token);
      },
      error: (error) => {
        console.error('Error en el registro', error);
        alert('Error en el registro: ' + (error.error?.message || 'Intente nuevamente'));
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
  }
}
