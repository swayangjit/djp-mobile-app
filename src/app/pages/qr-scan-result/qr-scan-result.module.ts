import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrScanResultPageRoutingModule } from './qr-scan-result-routing.module';

import { QrScanResultPage } from './qr-scan-result.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrScanResultPageRoutingModule,
    TranslateModule
  ],
  declarations: [QrScanResultPage]
})
export class QrScanResultPageModule {}
