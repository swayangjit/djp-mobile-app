import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController, Platform } from '@ionic/angular';
import { AppHeaderService } from 'src/app/services';
import { ContentService } from 'src/app/services/content/content.service';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';
import { Location } from '@angular/common';
import { PlayListContent } from 'src/app/services/playlist/models/playlist.content';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.page.html',
  styleUrls: ['./view-all.page.scss'],
})
export class ViewAllPage implements OnInit {
  contentList: Array<any> = [];
  type = '';
  playlists: Array<any> = [];
  deleteContent: any;
  selectedContents: Array<any> = [];
  @ViewChild(IonModal) modal: IonModal | undefined;
  constructor(
    private contentService: ContentService,
    private router: Router,
    private headerService: AppHeaderService,
    private playListService: PlaylistService,
    private platform: Platform,
    private location: Location
  ) {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras) {
      this.type = extras.state?.['type'];
    }
  }


  async ngOnInit(): Promise<void> {
    this.platform.backButton.subscribeWithPriority(11, async () => {
      this.location.back();
      this.headerService.deviceBackBtnEvent({name: 'backBtn'})
    });
    this.getRecentlyviewedContent()
  }

  async getPlaylistContent() {
    await this.playListService.getAllPlayLists('guest').then((result) => {
      if (result) {
        this.playlists = result;
      }
    }).catch((error) => {
      console.log('error', error)
    })
  }

  async getRecentlyviewedContent() {
    await this.contentService.getRecentlyViewedContent('guest').then((result) => {
      this.contentList = result;
      this.contentList.map((e: { metaData: string; }) => e.metaData = (typeof e.metaData === 'string') ? JSON.parse(e.metaData) : e.metaData)
    }).catch((err) => {
      console.log('error', err)
    })
  }


  createList() {
    let result: { [x: string]: any; }[] = [];
    this.contentList.forEach((e: { [x: string]: any; }) => {
      if (e['isSelected']) {
        result.push(e);
      }
    });
    console.log('...................', result)
    this.router.navigate(['/create-playlist'], {state: {selectedContents: result}})
  }

  async deletePlaylist() {
    await this.playListService.deletePlayList(this.deleteContent.identifier).then((data) => {
      this.getPlaylistContent()
    }).catch((err) => {
      console.log('err', err)
    })
  }

  ionViewWillEnter() {
    this.headerService.showHeader('new play list', true);
    this.getPlaylistContent();
  }


  openModal(content?: any) {
    console.log('create a modal for recently viewed content')
  }


  isContentSelect(event: any, index: any) {
    this.contentList[index]['isSelected'] = event.detail.checked;
    this.checkSelectedContent();
   }

   checkSelectedContent() {
     this.selectedContents = []
    this.contentList.forEach((e: { [x: string]: any; }) => {
      if (e['isSelected']) {
        this.selectedContents.push(e);
      }
    });
   }

}
