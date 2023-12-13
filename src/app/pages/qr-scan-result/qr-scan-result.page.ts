import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SheetModalComponent } from 'src/app/components/sheet-modal/sheet-modal.component';
import { AppHeaderService } from 'src/app/services';
import { OnTabViewWillEnter } from 'src/app/tabs/on-tabs-view-will-enter';

@Component({
  selector: 'app-qr-scan-result',
  templateUrl: './qr-scan-result.page.html',
  styleUrls: ['./qr-scan-result.page.scss'],
})
export class QrScanResultPage implements OnInit, OnTabViewWillEnter {
  configContents!: Array<any>
  optModalOpen: boolean = false;
  constructor(
    private headerService: AppHeaderService,
    private location: Location,
    private modalCtrl: ModalController,
  ) { }

  tabViewWillEnter(): void {
    this.headerService.showHeader('QrScan Result', true, []);
    this.headerService.showStatusBar();
  }

  ngOnInit() {
    this.headerService.headerEventEmitted$.subscribe((name: any) => {
      if(name == "back") {
        this.location.back();
      } 
    })
    this.configContents = [{metaData: {name: 'Res 1'}}, {metaData: {name: 'res 2'}}, {metaData: {name: 'res 3'}}]
  }

  navigateBack() {
    this.location.back();
  }
  ionViewWillEnter() {
    this.headerService.showHeader('QrScan Result', true, []);
    this.headerService.showStatusBar();
  }

  playContent(event: any, content: any) {

  }

  async moreOtions(content: any) {
    let modal: any;
    if(!this.optModalOpen) {
      this.optModalOpen = true;
      modal = await this.modalCtrl.create({
        component: SheetModalComponent,
        componentProps: {
          content: content
        },
        cssClass: 'sheet-modal',
        breakpoints: [0.3],
        showBackdrop: false,
        initialBreakpoint: 0.3,
        handle: false,
        handleBehavior: "none"
      });
      await modal.present();
    }
    modal.onDidDismiss().then(() => {
      this.optModalOpen = false;
    });
  }
}
