import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialComponent } from './tutorial.component';

@NgModule({
  declarations: [TutorialComponent],
  imports: [
    CommonModule
  ],
  exports: [TutorialComponent]
})
export class TutorialModule { }