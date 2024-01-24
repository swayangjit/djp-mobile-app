import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../../components/components.module";
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
    declarations: [HomePage],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        HomePageRoutingModule,
        TranslateModule,
        ComponentsModule,
        DirectivesModule
    ]
})
export class HomePageModule {}
