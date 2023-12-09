import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyPitaraPage } from './mypitara.page';

import { MyPitaraPageRoutingModule } from './mypitara-routing.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MyPitaraPageRoutingModule,
    TranslateModule
  ],
  declarations: [MyPitaraPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyPitaraPageModule {}
