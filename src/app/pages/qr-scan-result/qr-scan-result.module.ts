import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrScanResultPageRoutingModule } from './qr-scan-result-routing.module';

import { QrScanResultPage } from './qr-scan-result.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../../components/components.module";
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
    declarations: [QrScanResultPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        QrScanResultPageRoutingModule,
        TranslateModule,
        ComponentsModule,
        DirectivesModule
    ]
})
export class QrScanResultPageModule {}
