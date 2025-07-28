import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelCategoryModalComponent } from './del-category-modal.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [DelCategoryModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ]
})
export class DelCategoryModalModule { }
