import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelProfileModalComponent } from './del-profile-modal.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [DelProfileModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ]
})
export class DelProfileModalModule { }
