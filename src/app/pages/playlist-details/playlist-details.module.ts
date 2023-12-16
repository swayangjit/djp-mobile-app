import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaylistDetailsPageRoutingModule } from './playlist-details-routing.module';

import { PlaylistDetailsPage } from './playlist-details.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistDetailsPageRoutingModule,
    TranslateModule
  ],
  declarations: [PlaylistDetailsPage]
})
export class PlaylistDetailsPageModule {}
