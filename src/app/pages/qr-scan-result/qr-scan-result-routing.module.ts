import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrScanResultPage } from './qr-scan-result.page';

const routes: Routes = [
  {
    path: '',
    component: QrScanResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrScanResultPageRoutingModule {}
