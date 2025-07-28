// services/task.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<any[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private apiService: ApiService) {}

  // Crear nueva tarea
  create(taskData: any): Observable<any> {
    return this.apiService.post('task', taskData).pipe(
      tap(() => this.loadTasks())
    );
  }

  // Obtener tareas por categoría y estado
  getByCategory(categoryId: number, state: number = 0): Observable<any> {
    return this.apiService.get(`task/category/${categoryId}/${state}`);
  }

  // Actualizar detalles de la tarea
  updateDetails(id: number, details: any): Observable<any> {
    return this.apiService.patch(`task/details/${id}`, details);
  }

  // Cambiar estado (completado/pendiente)
  toggleState(id: number): Observable<any> {
    return this.apiService.patch(`task/state/${id}`, {});
  }

  // Eliminar tarea
  delete(id: number): Observable<any> {
    return this.apiService.delete(`task/${id}`);
  }

  private loadTasks(): void {
    // Implementar según necesidad
  }
}