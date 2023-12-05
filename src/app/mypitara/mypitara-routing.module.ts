import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPitaraPage } from './mypitara.page';

const routes: Routes = [
  {
    path: '',
    component: MyPitaraPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPitaraPageRoutingModule {}
