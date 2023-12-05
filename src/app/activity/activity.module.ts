import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityPage } from './activity.page';

import { ActivityPageRoutingModule } from './activity-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ActivityPageRoutingModule
  ],
  declarations: [ActivityPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityPageModule {}
