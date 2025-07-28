import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateTaskModalModule } from '../../components/ui/create-task-modal/create-task-modal.module';



@NgModule({
  declarations: [TasksComponent],
  imports: [
    CommonModule,
    CreateTaskModalModule,
    FormsModule,
    MatDialogModule,
  ]
})
export class TasksModule { }
