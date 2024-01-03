import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-qrcode-popup',
  templateUrl: './qrcode-popup.component.html',
  styleUrls: ['./qrcode-popup.component.scss'],
})
export class QrcodePopupComponent  implements OnInit {
  scanText: string = '';
  isValidURL: boolean = false;
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.scanText = this.navParams.get('scannedData');
    this.isValidURL = this.isValidUrl();
  }

  openLink() {
    this.close();
    window.open(this.scanText)
  }

  close() {
    this.modalCtrl.dismiss();
  }

  isValidUrl() {
    try {
      const newUrl = new URL(this.scanText);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
   }

}
