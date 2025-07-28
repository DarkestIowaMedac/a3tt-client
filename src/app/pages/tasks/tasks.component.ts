// tasks.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DelCategoryModalComponent } from '../../components/ui/del-category-modal/del-category-modal.component';

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

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories$ = this.categoryService.getCategories();
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
          this.loadCategories(); // Recargamos la lista después de actualizar
        },
        error: (err) => {
          console.error('Error al actualizar la categoría:', err);
        }
      });
    }
  }

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
      this.loadCategories(); // Recargar la lista si se eliminó
    }
  });
  }
}