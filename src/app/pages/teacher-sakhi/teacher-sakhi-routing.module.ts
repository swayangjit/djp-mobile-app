import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherSakhiPage } from './teacher-sakhi.page';

const routes: Routes = [
  {
    path: '',
    component: TeacherSakhiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherSakhiPageRoutingModule {}
