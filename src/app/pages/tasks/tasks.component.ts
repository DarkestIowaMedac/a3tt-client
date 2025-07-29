// tasks.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { TaskService } from '../../shared/services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { DelCategoryModalComponent } from '../../components/ui/del-category-modal/del-category-modal.component';
import { CreateTaskModalComponent } from '../../components/ui/create-task-modal/create-task-modal.component';
import { ToastrService } from '../../shared/toastr/toastr.service';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  categories$!: Observable<any[]>;
  newCategoryName = '';
  editingCategory: { id: number | null, name: string } = { id: null, name: '' };

  tasksByCategory: {[Key: number]: {pending: any[], completed: any[]}} = {};
  uncategorizedTasks: { pending: any[], completed: any[] } = { pending: [], completed: [] };
  showCompleted: { [key: number]: boolean } = {};
  showUncategorizedCompleted = false;
  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategoriesAndTasks();
  }

  loadCategoriesAndTasks(): void {
    this.categories$ = this.categoryService.getCategories().pipe(
      switchMap(categories => {
        // Inicializar estructura para tareas por categoría
        this.tasksByCategory = {};
        categories.forEach(cat => {
          this.tasksByCategory[cat.id] = { pending: [], completed: [] };
          this.showCompleted[cat.id] = false;
        });

        // Cargar tareas para cada categoría
        const categoryTasksRequests = categories.map(category => 
          this.loadTasksForCategory(category.id)
        );

        // También cargar tareas sin categoría (categoryId = 0)
        const uncategorizedRequest = this.loadTasksForCategory(-1);

        return forkJoin([...categoryTasksRequests, uncategorizedRequest]).pipe(
          map(() => categories)
        );
      })
    );
  }

  loadTasksForCategory(categoryId: number): Observable<any> {
    return forkJoin([
      this.taskService.getByCategory(categoryId, 0), // Pendientes
      this.taskService.getByCategory(categoryId, 1)  // Completadas
    ]).pipe(
      map(([pendingTasks, completedTasks]) => {
        if (categoryId === -1) {
          this.uncategorizedTasks = {
            pending: pendingTasks,
            completed: completedTasks
          };
        } else {
          this.tasksByCategory[categoryId] = {
            pending: pendingTasks,
            completed: completedTasks
          };
        }
      })
    );
  }

  getTasksByCategory(categoryId: number, state: number): any[] {
    if (categoryId === -1) {
      return state === 1 ? this.uncategorizedTasks.pending : this.uncategorizedTasks.completed;
    }
    const categoryTasks = this.tasksByCategory[categoryId];
    return categoryTasks ? (state === 0 ? categoryTasks.pending : categoryTasks.completed) : [];
  }

  getUncategorizedTasks(state: number): any[] {
    return state === 0 ? this.uncategorizedTasks.pending : this.uncategorizedTasks.completed;
  }

  toggleCompletedTasks(categoryId: number): void {
    this.showCompleted[categoryId] = !this.showCompleted[categoryId];
  }

  toggleUncategorizedCompleted(): void {
    this.showUncategorizedCompleted = !this.showUncategorizedCompleted;
  }

  openTaskDetails(task: any): void {
  const dialogRef = this.dialog.open(CreateTaskModalComponent, {
    width: '500px',
    data: { 
      task: task, // Enviamos la tarea completa
      categoryId: task.category?.id || -1,
      isEditMode: true // Activamos el modo edición
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.success) {
      this.updateTaskInLists(result.task);
    }
    else if(result?.err){
        if(Array.isArray(result?.err.error.message)){
          result.err.error.message = result.err.error.message[0]
        }
        const toastId = this.toastr.error((result?.err.error.message || 'Intente nuevamente'),
        'Error al editar la tarea');
      }
  });
  }

  private updateTaskInLists(updatedTask: any): void {
  const updateTaskInArray = (array: any[]) => {
    const index = array.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      array[index] = updatedTask;
    }
  };

  // Buscar en tareas categorizadas
  for (const categoryId in this.tasksByCategory) {
    updateTaskInArray(this.tasksByCategory[categoryId].pending);
    updateTaskInArray(this.tasksByCategory[categoryId].completed);
  }

  // Buscar en tareas sin categoría
  updateTaskInArray(this.uncategorizedTasks.pending);
  updateTaskInArray(this.uncategorizedTasks.completed);
  }

  // tasks.component.ts
deleteTask(task: any): void {
  this.taskService.delete(task.id).subscribe({
    next: () => {
      this.removeTaskFromLists(task.id);
    },
    error: (err) => {
      const toastId = this.toastr.error((err.error?.message[0] || 'Intente nuevamente'), 'Error al borrar la tarea');
      console.error('Error al eliminar la tarea:', err);
    }
  });
}

private removeTaskFromLists(taskId: number): void {
  // Eliminar de tareas categorizadas
  for (const categoryId in this.tasksByCategory) {
    this.tasksByCategory[categoryId].pending = this.tasksByCategory[categoryId].pending.filter(t => t.id !== taskId);
    this.tasksByCategory[categoryId].completed = this.tasksByCategory[categoryId].completed.filter(t => t.id !== taskId);
  }
  
  // Eliminar de tareas sin categoría
  this.uncategorizedTasks.pending = this.uncategorizedTasks.pending.filter(t => t.id !== taskId);
  this.uncategorizedTasks.completed = this.uncategorizedTasks.completed.filter(t => t.id !== taskId);
}
  startEditing(category: any): void {
    this.editingCategory = { id: category.id, name: category.name };
  }

  cancelEditing(): void {
    this.editingCategory = { id: null, name: '' };
  }

  createCategory(): void {
    if (this.newCategoryName.trim()) {
      this.categoryService.createCategory(this.newCategoryName).subscribe(() => {
        this.newCategoryName = ''; // Limpiamos el input
      });
    }
  }

  updateCategory(): void {
    if (this.editingCategory.id && this.editingCategory.name.trim()) {
      this.categoryService.update(
        this.editingCategory.id,
        this.editingCategory.name
      ).subscribe({
        next: () => {
          this.cancelEditing();
          this.loadCategoriesAndTasks(); // Recargamos la lista después de actualizar
        },
        error: (err) => {
          const toastId = this.toastr.error((err.error?.message[0] || 'Intente nuevamente'), 'Error al actualizar');
          console.error('Error al actualizar la categoría:', err);
        }
      });
    }
  }

  // En TasksComponent
  openDeleteDialog(category: any): void {
    const dialogRef = this.dialog.open(DelCategoryModalComponent, {
      width: '500px',
      data: { 
        categoryId: category.id, 
        categoryName: category.name 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        //const toastId = this.toastr.success('¡Tareas borradas en cascada!', 'Borrada');
        this.loadCategoriesAndTasks(); // Recargar solo si se confirmó la eliminación
      }
      else if(result?.err){
        if(Array.isArray(result?.err.error.message)){
          result.err.error.message = result.err.error.message[0]
        }
        const toastId = this.toastr.error((result?.err.error.message || 'Intente nuevamente'),
        'Error al borrar la categoría');
      }
    });
  }

  openCreateTaskModal(categoryId: number | null = null): void {
  const dialogRef = this.dialog.open(CreateTaskModalComponent, {
    width: '500px',
    data: { categoryId }
    
  });
    console.log(categoryId)
  dialogRef.afterClosed().subscribe(result => {
    if (result?.success) {
      console.log(result.task)
      const categoryId = result.task.category.id || -1;
      
      if (categoryId === -1 || categoryId === null) {
        this.uncategorizedTasks.pending.push(result.task);
      } else {
        if (this.tasksByCategory[categoryId]) {
          this.tasksByCategory[categoryId].pending.push(result.task);
        }
      }
    }
    else if(result?.err){
        if(Array.isArray(result?.err.error.message)){
          result.err.error.message = result.err.error.message[0]
        }
        const toastId = this.toastr.error((result?.err.error.message || 'Intente nuevamente'),
        'Error al crear la tarea');
    }
  });
  }

  // tasks.component.ts
toggleTaskState(task: any): void {
  const newState = task.state === 0 ? 1 : 0; // Cambia el estado
  
  this.taskService.toggleState(task.id).subscribe({
    next: (updatedTask) => {
      // Actualiza la tarea localmente sin recargar toda la lista
      this.updateTaskInLocalLists(task.id, newState);
    },
    error: (err) => {
      const toastId = this.toastr.error((err.error?.message[0] || 'Intente nuevamente'), 'Error en el registro');
      console.error('Error al cambiar el estado:', err);
      // Puedes revertir visualmente el checkbox si falla
      task.state = task.state; // Esto forzará el estado anterior
    }
  });
}

private updateTaskInLocalLists(taskId: number, newState: number): void {
  // Buscar y actualizar en tareas con categoría
  for (const categoryId in this.tasksByCategory) {
    const category = this.tasksByCategory[categoryId];
    
    // Buscar en pendientes
    const pendingIndex = category.pending.findIndex(t => t.id === taskId);
    if (pendingIndex !== -1) {
      if (newState === 1) {
        // Mover a completadas
        const task = category.pending.splice(pendingIndex, 1)[0];
        task.state = newState;
        category.completed.push(task);
      }
      return;
    }
    
    // Buscar en completadas
    const completedIndex = category.completed.findIndex(t => t.id === taskId);
    if (completedIndex !== -1) {
      if (newState === 0) {
        // Mover a pendientes
        const task = category.completed.splice(completedIndex, 1)[0];
        task.state = newState;
        category.pending.push(task);
      }
      return;
    }
  }
  
  // Buscar en tareas sin categoría
  const uncatPendingIndex = this.uncategorizedTasks.pending.findIndex(t => t.id === taskId);
  if (uncatPendingIndex !== -1) {
    if (newState === 1) {
      const task = this.uncategorizedTasks.pending.splice(uncatPendingIndex, 1)[0];
      task.state = newState;
      this.uncategorizedTasks.completed.push(task);
    }
    return;
  }
  
  const uncatCompletedIndex = this.uncategorizedTasks.completed.findIndex(t => t.id === taskId);
  if (uncatCompletedIndex !== -1) {
    if (newState === 0) {
      const task = this.uncategorizedTasks.completed.splice(uncatCompletedIndex, 1)[0];
      task.state = newState;
      this.uncategorizedTasks.pending.push(task);
    }
  }
}
  
}