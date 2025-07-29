// delete-category-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-delete-category-modal',
  standalone: false,
  templateUrl: './del-category-modal.component.html',
  styleUrls: ['./del-category-modal.component.scss']
})
export class DelCategoryModalComponent {
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<DelCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoryId: number, categoryName: string }
  ) {}

  onConfirm(): void {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.categoryService.delete(this.data.categoryId).subscribe({
      next: () => {
        this.dialogRef.close({ success: true });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al eliminar la categoría';
        console.error('Error:', err);
        this.dialogRef.close({ success: false, err: err})
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}