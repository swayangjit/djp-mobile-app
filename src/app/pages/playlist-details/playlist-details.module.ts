import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaylistDetailsPageRoutingModule } from './playlist-details-routing.module';

import { PlaylistDetailsPage } from './playlist-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistDetailsPageRoutingModule,
    TranslateModule,
    DirectivesModule
  ],
  declarations: [PlaylistDetailsPage]
})
export class PlaylistDetailsPageModule {}
