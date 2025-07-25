import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from '../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { EdProfileModalComponent } from '../../components/ui/ed-profile-modal/ed-profile-modal.component';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user = {
    id: 3,
    name: 'Alex García',
    email: 'alex@ejemplo.com',
    stats: {
      tasksCompleted: 0,
      tasksPending: 0,
      categories: 0
    },
  };

  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    //this.loadStatistics();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    // Suponiendo que tienes un método para obtener los datos del usuario logueado
    const cut = this.authService.getDecodedToken();
    //if (cut) {
    //   this.user.id = cut.sub;
    //   this.user.name = cut.name;
    //   this.user.email = cut.email;
    // } // <- Actualmente desde el token podría sacarse todo
    //this.apiService.get(`users/id/${this.user.id}`) // <- Este endpoint sirve pero mejor usar el seguro
    this.apiService.get(`auth/getProfile`).subscribe({ // <- Este endpoint actualmente saca la info del
      //propio JWT, lo que no es lo suyo para obtener más datos. Se puede modificar de cara a futuro
      next: (userDetails) => {
        this.user = {
          ...this.user, 
          id: userDetails.sub,
          name: userDetails.name,
          email: userDetails.email,
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.errorMessage = 'Error al cargar el perfil';
        this.isLoading = false;
      }
    })
  }

  openEditModal(): void {
    const dialogRef = this.dialog.open(EdProfileModalComponent, {
      width: '500px',
      data: { currentName: this.user.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.user.name = result.name; // Actualiza el nombre si se editó
      }
    });
  }

  logout(): void {
    this.authService.logout(); 
  }
  
}