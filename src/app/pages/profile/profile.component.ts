import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user = {
    name: 'Alex García',
    email: 'alex@ejemplo.com',
    joinDate: '15 Enero 2023',
    avatar: 'assets/images/avatar-placeholder.png', // Puedes usar una imagen por defecto
    bio: 'Desarrollador frontend con experiencia en Angular y diseño de interfaces.',
    stats: {
      tasksCompleted: 42,
      projects: 5,
      lastActive: 'Hace 2 horas'
    }
  };

  constructor(
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout(); // Llama al método logout de tu AuthService
  }
}