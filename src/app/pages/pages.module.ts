import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountModule } from './account/account.module';
import { TasksModule } from './tasks/tasks.module';
import { HomeModule } from './home/home.module';




@NgModule({
  declarations: [],
  imports: [
    AccountModule,
    TasksModule,
    HomeModule,
    CommonModule,
  ],
  exports: []
})
export class PagesModule { }
