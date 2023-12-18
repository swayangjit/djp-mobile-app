import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoryPage } from './story.page';

import { StoryPageRoutingModule } from './story-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StoryPageRoutingModule,
    ComponentsModule
  ],
  declarations: [StoryPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoryPageModule {}
