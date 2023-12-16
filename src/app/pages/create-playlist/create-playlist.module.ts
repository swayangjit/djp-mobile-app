import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePlaylistPageRoutingModule } from './create-playlist-routing.module';

import { CreatePlaylistPage } from './create-playlist.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePlaylistPageRoutingModule,
    TranslateModule
  ],
  declarations: [CreatePlaylistPage]
})
export class CreatePlaylistPageModule {}
