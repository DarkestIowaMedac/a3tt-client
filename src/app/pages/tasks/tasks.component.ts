// tasks.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { TaskService } from '../../shared/services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { DelCategoryModalComponent } from '../../components/ui/del-category-modal/del-category-modal.component';
import { CreateTaskModalComponent } from '../../components/ui/create-task-modal/create-task-modal.component';

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
    private dialog: MatDialog
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
        if (categoryId === 0) {
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
    if (categoryId === 0) {
      return state === 0 ? this.uncategorizedTasks.pending : this.uncategorizedTasks.completed;
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

  // Métodos para manejar tareas (los implementarás más adelante)
  toggleTaskState(task: any): void {
    // Implementar lógica para cambiar estado de tarea
  }

  openTaskDetails(task: any): void {
    // Implementar lógica para ver detalles de tarea
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
        this.loadCategoriesAndTasks(); // Recargar solo si se confirmó la eliminación
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
  });
  }
}