import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [TasksComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ]
})
export class TasksModule { }
