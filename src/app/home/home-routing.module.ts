import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { StartPageComponent } from './start/start.page.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
  },{
    path: 'start',
    component: StartPageComponent,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
