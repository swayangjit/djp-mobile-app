import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-playlist-modal',
  templateUrl: './new-playlist-modal.component.html',
  styleUrls: ['./new-playlist-modal.component.scss'],
})
export class NewPlaylistModalComponent  implements OnInit {

  playlistName = '';
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  cancel() {
    this.modalCtrl.dismiss();
  }

  createPlaylist() {
    if (this.playlistName) {
      this.modalCtrl.dismiss({type: 'create', playlistName: this.playlistName})
    }
  }
}
