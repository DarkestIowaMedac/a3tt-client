// services/category.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<any[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.apiService.get('category/user').pipe(
      tap(categories => this.categoriesSubject.next(categories))
    ).subscribe();
  }

  getCategories(): Observable<any[]> {
    return this.categories$;
  }

  createCategory(name: string): Observable<any> {
    return this.apiService.post('category', { name }).pipe(
      tap(() => this.loadCategories()) // Recargamos las categorías después de crear una nueva
    );
  }

   update(id: number, name: string): Observable<any> {
    return this.apiService.patch(`category/${id}`, { name }).pipe(
      tap(() => this.loadCategories())
    );
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`category/${id}`).pipe(
      tap(() => this.loadCategories())  
    );
  }

}