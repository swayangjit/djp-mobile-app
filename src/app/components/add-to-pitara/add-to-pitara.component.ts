import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { UtilService } from 'src/app/services';
import { PlayList, PlayListContent } from 'src/app/services/playlist/models/playlist.content';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';

@Component({
  selector: 'app-add-to-pitara',
  templateUrl: './add-to-pitara.component.html',
  styleUrls: ['./add-to-pitara.component.scss'],
})
export class AddToPitaraComponent  implements OnInit {
  selectedContentId = '';
  content: any
  playlists: Array<any> = [];
  isOpen=false;
  constructor(
    private playListService: PlaylistService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private utilService: UtilService) { }

  async ngOnInit() {
    this.content = this.navParams.get('content')
    console.log('this.content', this.content)
    this.getAllPlaylists()
  }

  async getAllPlaylists(name?: string) {
    this.playlists = [];
    await this.playListService.getAllPlayLists('guest').then((result: Array<PlayList>) => {
      this.playlists = result;
      if (name) {
        this.selectedContentId = this.playlists.find((e) => e.name.toLowerCase()===name.toLowerCase()).identifier || this.playlists[0].identifier;
      }
      console.log('playlists', this.playlists);
    }).catch((error) => {
      console.log('error', error)
    })
  }

  playlistSelected(ev: any) {
    let val = ev.detail.value;
    console.log('Current value:', JSON.stringify(val));
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async saveContent() {
    console.log('/./.', this.selectedContentId);
    if (this.selectedContentId && this.content.metaData) {
      await this.playListService.addContentToPlayList(this.selectedContentId, [this.content.metaData.identifier]).then((data) => {
        console.log('content added successfull', data)
      })
      this.modalCtrl.dismiss();
    }
  }

  async newPitaraList() {
    const alert = await this.alertController.create({
      header: this.utilService.translateMessage('New playlist'),
      inputs: [
        {
          name: 'name',
          type: 'text'
        }],
      buttons: [
        {
          text: this.utilService.translateMessage('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: this.utilService.translateMessage('Create'),
          role: 'create',
          handler: (alertData) => {
            console.log(alertData.name);
          }
        }
      ]
    });
    await alert.present();
    const obj = await alert.onDidDismiss();
    let name = obj.data.values.name;

    let request: Array<PlayListContent> = [{identifier: this.content.metaData.identifier, type: 'content' }];
    if (obj.role === 'create') {
      this.playListService.createPlayList(name, 'guest', [{identifier: '', type: 'content'}]).then((data) => {
        // API
        this.getAllPlaylists(name);
      }).catch((err) => {
        console.log('errrrr', err)
      })
    }
  }

  confirm(e: any) {
    this.isOpen=false;
  }
}
