import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherSakhiPageRoutingModule } from './teacher-sakhi-routing.module';

import { TeacherSakhiPage } from './teacher-sakhi.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [TeacherSakhiPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TeacherSakhiPageRoutingModule,
        TranslateModule,
        ComponentsModule
    ]
})
export class TeacherSakhiPageModule {}
