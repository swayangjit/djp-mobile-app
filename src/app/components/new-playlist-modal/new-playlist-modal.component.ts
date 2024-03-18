import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { regDiksha } from 'src/app/appConstants';

@Component({
  selector: 'app-new-playlist-modal',
  templateUrl: './new-playlist-modal.component.html',
  styleUrls: ['./new-playlist-modal.component.scss'],
})
export class NewPlaylistModalComponent  implements OnInit {
  name = '';
  title = '';
  placeholder= '';
  url = "";
  errMsg = '';
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.title = this.navParams.get('title');
    this.placeholder = this.navParams.get('placeholder');
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  createPlaylist() {
    if (this.name) {
      if(this.title == 'Add Youtube URL' && this.url) {
        const regExp = /(?:youtu\.be\/|youtube\.com(?:\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/|embed\/|v\/|m\/|watch\?(?:[^=]+=[^&]+&)*?v=))([^"&?\/\s]{11})/gm;
        if(this.url.match(regExp)){
          this.modalCtrl.dismiss({type: 'create', name: this.name, url: this.url})
        } else {
          this.errMsg = "Please enter a valid url"
        }
      } else {
        this.modalCtrl.dismiss({type: 'create', playlistName: this.name})
      }
    } else if(this.title == 'Add Diksha URL' && this.url) {
      let validUrl = false;
      regDiksha.forEach(regExp => {
        if(this.url.match(new RegExp(regExp.pattern))) {
          validUrl = true;
        }
      })
      if(validUrl){
        this.modalCtrl.dismiss({type: 'create', url: this.url})
      } else {
        this.errMsg = "Please enter a valid url"
      }
    }
  }

  onInputChange() {
    this.errMsg = "";
  }
}
