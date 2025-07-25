import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomingFeaturesComponent } from './incoming-features.component';

@NgModule({
  declarations: [IncomingFeaturesComponent],
  imports: [
    CommonModule
  ],
  exports: [IncomingFeaturesComponent]
})
export class IncomingFeaturesModule { }