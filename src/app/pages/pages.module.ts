import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountModule } from './account/account.module';
import { TasksModule } from './tasks/tasks.module';
import { HomeModule } from './home/home.module';
import { TutorialModule } from './tutorial/tutorial.module';
import { IncomingFeaturesModule } from './incoming-features/incoming-features.module';
import { ProfileModule } from './profile/profile.module';




@NgModule({
  declarations: [],
  imports: [
    AccountModule,
    TasksModule,
    HomeModule,
    TutorialModule,
    IncomingFeaturesModule,
    ProfileModule,
    CommonModule,
  ],
  exports: []
})
export class PagesModule { }
