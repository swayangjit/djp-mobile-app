import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentSakhiPageRoutingModule } from './parent-sakhi-routing.module';

import { ParentSakhiPage } from './parent-sakhi.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [ParentSakhiPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ParentSakhiPageRoutingModule,
        ComponentsModule
    ]
})
export class ParentSakhiPageModule {}
