// services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private authStatus = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.authStatus.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
    
  ) {this.authStatus.next(!!this.getToken());

    // Escucha cambios en otras pestañas
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }

  ngOnDestroy(): void {
    // Limpia el listener para evitar memory leaks
    window.removeEventListener('storage', this.handleStorageEvent.bind(this));
  }
  
  private handleStorageEvent(event: StorageEvent): void {
    // Solo reacciona a cambios en nuestro token
    if (event.key === this.TOKEN_KEY) {
      const currentPath = this.router.url;
      const isNowAuthenticated = !!localStorage.getItem(this.TOKEN_KEY);
      
      // Actualiza el estado
      this.authStatus.next(isNowAuthenticated);
      
      // Redirige si se perdió la autenticación y está en zona privada
      if (!isNowAuthenticated && currentPath.startsWith('/private')) {
        this.router.navigate(['/login']);
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (!payload.iat) return true;
      
      const tokenLifetime = 3600; 
      const expirationTime = payload.iat + tokenLifetime;
      
      // Compara con el tiempo actual (conversión de ms a segundos)
      return expirationTime < Math.floor(Date.now() / 1000);
    } catch {
      return true; 
    }
  }

  login(credentials: {email: string, password: string}) {
    return this.apiService.post('auth/login', credentials).pipe(
      tap(response => {
        if (!response.access_token) throw new Error('Invalid response');
        this.saveToken(response.access_token); 
        this.router.navigate(['/tutorial']);
      })
    );
  }

  register(userData: any) {
    return this.apiService.post('auth/register', userData).pipe(
      tap({
        next: (response) => {
        },
        error: (err) => {
          throw err; 
        }
      })
    );
  }

  saveToken(token: string): void {
    if (!token || this.isTokenExpired(token)) { 
      this.logout();
      return;
    }
    localStorage.setItem(this.TOKEN_KEY, token);
    this.authStatus.next(true);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
  
    if (!token || this.isTokenExpired(token)) {
      this.logout(); 
      return null;
    }
    return token 
  }

  getDecodedToken(): any {
    const token = this.getToken()

    if (token == null) {
      return null
    }
    return jwtDecode(token);
  }

  isLoggedIn(): boolean {
    return this.authStatus.value;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }
}