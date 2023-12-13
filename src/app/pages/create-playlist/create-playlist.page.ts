import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ContentService } from 'src/app/services/content/content.service';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { MimeType } from 'src/app/appConstants';
import { Capacitor } from '@capacitor/core';
import { PlayListContent} from '../../services/playlist/models/playlist.content'
import { AppHeaderService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.page.html',
  styleUrls: ['./create-playlist.page.scss'],
})

export class CreatePlaylistPage implements OnInit {
  contentList: Array<any> = [];
  public files: PickedFile[] = [];
  resolveNativePath = (path : string) =>
  new Promise((resolve, reject) => {
    (window as any).FilePath.resolveNativePath(path, resolve, (err : any) => {
      console.error(
        `${path} could not be resolved by the plugin: ${err.message}`
      )
      reject(err)
    })
  });
  selectedContents: Array<any> = [];
  constructor(
    private contentService: ContentService,
    private alertController: AlertController,
    private playListService: PlaylistService,
    private headerService: AppHeaderService,
    private router: Router
  ) {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras) {
      this.selectedContents = extras.state?.['selectedContents'];
    }
  }

  ngOnInit() {
    this.contentService.getRecentlyViewedContent('guest').then((result) => {
      this.contentList = result;
      console.log('result', result)
    })
  }

  ionViewWillEnter() {
    this.headerService.showHeader('create new contentList', true)
  }

  isContentSelect(event: any, index: any) {
    this.selectedContents[index]['isSelected'] = event.detail.checked;
   }

  async createList() {
    const alert = await this.alertController.create({
      header: 'New playlist',
      inputs: [
        {
          name: 'name',
          type: 'text'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Create',
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

    let result: Array<PlayListContent> = [];
    this.selectedContents.forEach((e: { [x: string]: any; }) => {
      if (e['isSelected']) {
        result.push({ identifier: e['contentIdentifier'], type: 'recentlyViewed' });
      }
    });
    if (obj.role === 'create') {
      this.playListService.createPlayList(name, 'guest', result).then((data) => {
        // API
        this.headerService.deviceBackBtnEvent({name: 'backBtn'})
        window.history.go(-2)
      }).catch((err) => {
        console.log('errrrr', err)
      })
    }
  }


  public async openFilePicker() {
    let mimeType: string[] = [MimeType.PDF];
    mimeType = mimeType.concat(MimeType.VIDEOS).concat(MimeType.AUDIO);
    const { files } = await FilePicker.pickFiles({ types: mimeType, multiple: true, readData: true });
    this.files = files;
    files.map(async (file: any)=>{
      const path = await this.resolveNativePath(file.path!)
      console.log('path', path);
    })
    console.log('Files:::', files);
  }
  

}
