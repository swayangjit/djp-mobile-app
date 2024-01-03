import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recording-alert',
  templateUrl: './recording-alert.component.html',
  styleUrls: ['./recording-alert.component.scss'],
})
export class RecordingAlertComponent  implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  hadleAudioSearch() {
    this.modalCtrl.dismiss('search');
  }

}
