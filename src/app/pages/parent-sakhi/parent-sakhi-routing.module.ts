import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentSakhiPage } from './parent-sakhi.page';

const routes: Routes = [
  {
    path: '',
    component: ParentSakhiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentSakhiPageRoutingModule {}
