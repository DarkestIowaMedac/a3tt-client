import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { EdProfileModalModule } from '../../components/ui/ed-profile-modal/ed-profile-modal.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    EdProfileModalModule,
    FormsModule
  ],
  exports: [ProfileComponent]
})
export class ProfileModule { }