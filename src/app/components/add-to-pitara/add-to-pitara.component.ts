import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { UtilService } from 'src/app/services';
import { PlayList, PlayListContent } from 'src/app/services/playlist/models/playlist.content';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';
import { NewPlaylistModalComponent } from '../new-playlist-modal/new-playlist-modal.component';

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

   ngOnInit() {
    this.content = this.navParams.get('content')
    console.log('this.content', this.content)
    this.getAllPlaylists()
  }

  async getAllPlaylists(name?: string) {
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
      let req : any = [{
        identifier: this.content.metaData.identifier,
        type:  'content',
        localContent : this.content
      }]
      await this.playListService.addContentToPlayList(this.selectedContentId, req).then((data) => {
        console.log('content added successfull', data)
      })
      this.modalCtrl.dismiss();
    }
  }

  async newPitaraList() {
    const modal = await this.modalCtrl.create({
      component: NewPlaylistModalComponent,
      cssClass: 'auto-height'
    });
    await modal.present();
    modal.onWillDismiss().then((result) => {
      if (result && result.data.type === 'create' && result.data.playlistName) {
        this.playListService.createPlayList(result.data.playlistName, 'guest', [{ identifier: '', type: 'content', localContent: undefined }]).then((data) => {
          // API
          this.getAllPlaylists(result.data.playlistName);
        }).catch((err) => {
          console.log('errrrr', err)
        })
      }
    });
  }

  confirm(e: any) {
    this.isOpen=false;
  }
}
