import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-upload-local',
  templateUrl: './upload-local.component.html',
  styleUrls: ['./upload-local.component.scss'],
})
export class UploadLocalComponent  implements OnInit {
  youtubeurl: string = ""
  uploadType: Array<any> = [];

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.uploadType = this.navParams.get('uploadType')
  }

  async upload(type: string) {
    console.log('type ', type);
    this.modalCtrl.dismiss({type});
  }

}
