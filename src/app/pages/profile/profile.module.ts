import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { EdProfileModalModule } from '../../components/ui/ed-profile-modal/ed-profile-modal.module';
import { FormsModule } from '@angular/forms';
import { DelProfileModalModule } from '../../components/ui/del-profile-modal/del-profile-modal.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    EdProfileModalModule,
    DelProfileModalModule,
    FormsModule
  ],
  exports: [ProfileComponent]
})
export class ProfileModule { }