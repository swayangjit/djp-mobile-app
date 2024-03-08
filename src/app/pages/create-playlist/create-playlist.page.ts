import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content/content.service';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { PlayListContent} from '../../services/playlist/models/playlist.content'
import { AppHeaderService, UtilService } from 'src/app/services';
import { Router } from '@angular/router';
import { MimeType, PlayerType } from 'src/app/appConstants';
import { ContentUtil } from 'src/app/services/content/util/content.util';
import { Location } from '@angular/common';
import getYouTubeID from 'get-youtube-id';
import { SHA1 } from 'crypto-js';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.page.html',
  styleUrls: ['./create-playlist.page.scss'],
})

export class CreatePlaylistPage implements OnInit {
  contentList: Array<any> = [];
  playlists: any;
  playlistName = '';
  disableCreateBtn: boolean = true;
  public files: PickedFile[] = [];
  navigateBack: boolean = false;
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
  reSelectedContent: Array<any> = [];
  localContents: number = 0;
  status = '';
  constructor(
    private contentService: ContentService,
    private playListService: PlaylistService,
    private headerService: AppHeaderService,
    private router: Router,
    private location: Location,
    private utilService: UtilService
  ) {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras) {
      if (extras.state?.['islocal']){
        this.playlists = extras.state?.['playlists'];
        this.selectedContents = this.playlists['playListcontentList'];
        this.selectedContents.map((e) => {
          e['isSelected'] = true;
          if (!e['metaData'] && e['content_metadata']) {
            e['metaData'] = JSON.parse(e['content_metadata'])
          }
        });
        this.playlistName = this.playlists.name;
        this.status = extras.state?.['status'];
      } else {
        this.selectedContents = extras.state?.['selectedContents'];
      }
      this.selectedContents = this.selectedContents.filter((e) => e['metaData']);
      this.reSelectedContent = this.selectedContents;
    }
  }

  ngOnInit() {
    this.getContentImgPath();
    this.contentService.getRecentlyViewedContent('guest').then((result) => {
      this.contentList = result;
      console.log('result', result)
    });
    this.headerService.headerEventEmitted$.subscribe((event) => {
      if (event === 'back' && this.status === 'edit' && !this.navigateBack) {
        this.navigateBack = true;
        this.router.navigate(['/tabs/my-pitara'])
      }
    });
  }

  ionViewWillEnter() {
    this.headerService.showHeader('create New Playlist', true)
  }

  isContentSelect(event: any, index: any) {
    this.selectedContents[index]['isSelected'] = event.detail.checked;
    this.reSelectedContent = [];
    this.selectedContents.forEach((e: { [x: string]: any; }) => {
      if (e['isSelected']) {
        this.reSelectedContent.push({ identifier: e['metaData']['contentIdentifier']});
      }
    });
    this.disableCreateBtn = false;
    if(this.reSelectedContent.length == 0) {
      this.disableCreateBtn = true
    }
  }

  playlistNameChange() {
    if((this.playlistName.replace(/\s/g, '').length > 0 && this.selectedContents.length > 0) || this.playlistName !== this.playlists?.name) {
      this.disableCreateBtn = false
    }
  }

  async createList() {
    let request: Array<PlayListContent> = [];
    this.selectedContents.forEach((e: any) => {
      if (e['type'] === 'local' || e['source'] === 'local' ) {
        request.push({identifier: e['identifier'], type: 'local', localContent: e, isDeleted: !e['isSelected']})
      } else {
        if(e['isSelected']) {
          request.push({ identifier: e['contentIdentifier'], type: 'recentlyViewed' , localContent: e});
        } else {
          request.push({identifier: e['identifier'], type: e['type'], localContent: e, isDeleted: true})
        }
      }
    });
    if (this.playlistName.replace(/\s/g, '').length > 0) {
      let identifier = this.playlists ? this.playlists.identifier : undefined;
      this.playListService.createPlayList(this.playlistName, 'guest', request, identifier).then((data) => {
        // API
        this.headerService.deviceBackBtnEvent({name: 'backBtn'})
        if (this.status === 'edit') {
          this.location.back();
        } else {
          window.history.go(-2)
        }
      }).catch((err) => {
        console.log('errrrr', err)
      })
    }
  }


  public async openFilePicker() {
    let mimeType: string[] = [MimeType.PDF];
    mimeType = mimeType.concat(MimeType.VIDEOS).concat(MimeType.AUDIO);
    const { files } = await FilePicker.pickFiles({ types: mimeType, multiple: true, readData: true });
    const loader = await this.utilService.getLoader()
    await loader.present();
    for (let i=0; i<files.length; i++) {
      const path: string = await this.resolveNativePath(files[i].path!)as string;
      console.log('path', path);
      const fileName = path.substring(path.lastIndexOf('/') + 1);
      this.selectedContents.push({
        source: 'local',
        sourceType: 'local',
        metaData: {
          identifier: SHA1(path).toString(),
          url: path,
          name: fileName,
          mimetype: ContentUtil.getMimeType(fileName),
          thumbnail: ''
        }
      })
    }
    await loader.dismiss()
    if (this.selectedContents.length) {
      this.getContentImgPath();
    }
  }
  
  getContentImgPath(){
    this.selectedContents.forEach((ele) => {
      if (!ele.metaData['thumbnail']) {
        if (ele.metaData.mimetype === PlayerType.YOUTUBE) {
          ele.metaData['thumbnail'] = this.loadYoutubeImg(ele.metaData);
        } else {
          ele.metaData['thumbnail'] = (ele.metaData.thumbnail && !ele.metaData.identifier.startsWith('do_')) ? ele.metaData.thumbnail : ContentUtil.getImagePath(ele.metaData.mimetype || ele.metaData.mimeType)
        }
      } else if(ele.metaData.mimeType !== PlayerType.YOUTUBE) {
          ele.metaData['thumbnail'] = (ele.metaData.thumbnail && !ele.metaData.identifier.startsWith('do_')) ? ele.metaData.thumbnail : ContentUtil.getImagePath(ele.metaData.mimetype || ele.metaData.mimeType)
        }
    })
  }

  loadYoutubeImg(metaData: any): string {
    let id = metaData.identifier;
    if(id && id.startsWith("do_")) {
      id = getYouTubeID(metaData.url);
    }
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  }

}
