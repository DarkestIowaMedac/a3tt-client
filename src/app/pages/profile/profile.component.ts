import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from '../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { EdProfileModalComponent } from '../../components/ui/ed-profile-modal/ed-profile-modal.component';
import { DelProfileModalComponent } from '../../components/ui/del-profile-modal/del-profile-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map } from 'rxjs';
import { ToastrService } from '../../shared/toastr/toastr.service';

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
    private dialog: MatDialog,
    // private snackBar: MatSnackBar
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadStatistics();
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
        if(Array.isArray(err?.error.message)){
          err.error.message = err.error.message[0]
        }
        const toastId = this.toastr.error((err.error.message || 'Intente nuevamente'), 'Fallo al cargar su información');
        console.error('Error loading profile:', err);
        this.errorMessage = 'Error al cargar el perfil';
        this.isLoading = false;
      }
    })
  }

  loadStatistics(): void {
    // Obtener categorías del usuario
    const categories$ = this.apiService.get('category/user');
    
    // Obtener tareas sin categoría (pendientes y completadas)
    const uncategorizedPending$ = this.apiService.get('task/category/-1/0');
    const uncategorizedCompleted$ = this.apiService.get('task/category/-1/1');
    
    forkJoin([categories$, uncategorizedPending$, uncategorizedCompleted$]).subscribe({
      next: ([categories, uncategorizedPending, uncategorizedCompleted]) => {
        // Calcular total de tareas pendientes y completadas de categorías
        let totalPending = uncategorizedPending.length;
        let totalCompleted = uncategorizedCompleted.length;
        
        if (categories.length === 0) {
          this.updateStats(totalCompleted, totalPending, 0);
          return;
        }

        // Sumar tareas de cada categoría
        const categoryTasksRequests = categories.map((category:any) => 
          forkJoin([
            this.apiService.get(`task/category/${category.id}/0`), // Pendientes
            this.apiService.get(`task/category/${category.id}/1`)  // Completadas
          ]).pipe(
            map(([pending, completed]) => {
              return {
                pendingCount: pending.length,
                completedCount: completed.length
              };
            })
          )
        );
        
        // Solución definitiva para el error TS2769
  forkJoin(categoryTasksRequests).subscribe({
    next: (results: unknown) => {
      const typedResults = results as {pendingCount: number, completedCount: number}[];
      typedResults.forEach(result => {
        totalPending += result.pendingCount;
        totalCompleted += result.completedCount;
      });
      this.updateStats(totalCompleted, totalPending, categories.length);
    },
          error: (err: any) => {
            console.error('Error loading category tasks:', err);
            this.errorMessage = 'Error al cargar estadísticas';
          }
        });
      }, // <-- Cierre del primer next
      error: (err: any) => {
        console.error('Error loading statistics:', err);
        this.errorMessage = 'Error al cargar estadísticas';
      }
    });
  }
  private updateStats(completed: number, pending: number, categories: number): void {
    this.user.stats = {
      tasksCompleted: completed,
      tasksPending: pending,
      categories: categories
    };
  }  

  openEditModal(): void {
    const dialogRef = this.dialog.open(EdProfileModalComponent, {
      width: '500px',
      data: { currentName: this.user.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.authService.logout();
        const toastId = this.toastr.success('¡Datos cambiados, vuelva a loguearse para seguir '+ 
          'conectado!', 'Información editada');
      }
      else if(result?.err){
        if(Array.isArray(result?.err.error.message)){
          result.err.error.message = result.err.error.message[0]
        }
        const toastId = this.toastr.error((result?.err.error.message || 'Intente nuevamente'), 
        'Error al editar');
      }
    });
  }

  openDeleteModal(): void {
    const dialogRef = this.dialog.open(DelProfileModalComponent, {
      width: '500px',
      data: { currentEmail: this.user.email }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.authService.logout();
        const toastId = this.toastr.success('¡Esperamos haberle sido de utilidad, vuelva '+ 
          'cuando quiera!', 'Cuenta eliminada');
      }
      else{
        if(Array.isArray(result?.err.error.message)){
          result.err.error.message = result.err.error.message[0]
        }
        const toastId = this.toastr.error((result?.err.error.message || 'Intente nuevamente'), 'No se ha podido borrar su cuenta');
      }
    });
  }

  logout(): void {
    this.authService.logout(); 
    const toastId = this.toastr.info('Sesión Cerrada, '+ 
          'vuelva cuando quiera!', 'Sesión Cerrada');
  }
  
}