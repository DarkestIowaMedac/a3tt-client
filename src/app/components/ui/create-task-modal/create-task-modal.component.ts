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

  //--Para Edición--
  isEditMode = false;
  currentTaskId: number | null = null;
  //--

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<CreateTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoryId: number | null 
      task?: any,
      isEditMode?: boolean 
    }
  ) {
    this.isEditMode = data.isEditMode || false;

    this.taskForm = this.fb.group({
      name: ['', [Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });

    if (this.isEditMode && data.task) {
      this.currentTaskId = data.task.id;
      this.taskForm.patchValue({
        name: data.task.name,
        description: data.task.description
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;
    
    this.isSubmitting = true;
    this.errorMessage = null;

    const taskData = {
      name: this.taskForm.value.name.trim() || null,
      description: this.taskForm.value.description.trim() || null,
      //categoryId: this.data.categoryId
      //state: 0 // Pendiente por defecto
    };

    const payload = Object.fromEntries(
    Object.entries(taskData).filter(([_, v]) => v !== null)
    );

    if (this.isEditMode && this.currentTaskId) {
      this.taskService.updateDetails(this.currentTaskId, payload).subscribe({
        next: (updatedTask) => {
          this.dialogRef.close({ 
            success: true, 
            task: {
              ...this.data.task, // Mantenemos los datos originales
              ...updatedTask // Actualizamos con los cambios
            }
          });
        },
        error: (err) => {
        this.isSubmitting = false;
        console.error('Error updating task:', err);
        this.dialogRef.close({ success: false, err: err})
        this.handleError.bind(this)
        //alert('Error updating profile: ' + (err.error?.message || 'Please try again'));
        }
      });
    } else {
      this.taskService.create({
        ...payload,
        categoryId: this.data.categoryId,
      }).subscribe({
        next: (response) => {
          this.dialogRef.close({ success: true, task: response });
        },
         error: (err) => {
        this.isSubmitting = false;
        console.error('Error creating task:', err);
        this.dialogRef.close({ success: false, err: err})
        this.handleError.bind(this)
        }
      });
    }
  }

  private handleError(err: any): void {
    this.isSubmitting = false;
    this.errorMessage = err.error?.message || 'Error al procesar la solicitud';
    console.error('Error:', err);
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}