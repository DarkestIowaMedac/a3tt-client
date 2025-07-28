import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateTaskModalComponent } from './create-task-modal.component';
import { MatDialogModule } from '@angular/material/dialog';




@NgModule({
  declarations: [CreateTaskModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [CreateTaskModalComponent]
})
export class CreateTaskModalModule { }
