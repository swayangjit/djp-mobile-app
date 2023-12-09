import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BotPageRoutingModule } from './bot-routing.module';

import { BotPage } from './bot.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BotPageRoutingModule,
    TranslateModule
  ],
  declarations: [BotPage]
})
export class BotPageModule {}
