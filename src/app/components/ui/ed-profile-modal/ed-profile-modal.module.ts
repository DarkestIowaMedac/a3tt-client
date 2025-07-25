import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdProfileModalComponent } from './ed-profile-modal.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [EdProfileModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ]
})
export class EdProfileModalModule { }
