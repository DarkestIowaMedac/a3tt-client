// create-task-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../../shared/services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-task-modal',
  standalone: false,
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss']
})
export class CreateTaskModalComponent {
  taskForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<CreateTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoryId: number | null }
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;
    
    this.isSubmitting = true;
    this.errorMessage = null;

    const taskData = {
      name: this.taskForm.value.name,
      description: this.taskForm.value.description,
      categoryId: this.data.categoryId
      //state: 0 // Pendiente por defecto
    };

    this.taskService.create(taskData).subscribe({
      next: (response) => {
        this.dialogRef.close({ success: true, task: response });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al crear la tarea';
        console.error('Error:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}