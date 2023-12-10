import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { PlaylistModalComponent } from 'src/app/components/playlist-modal/playlist-modal.component';
import { AppHeaderService } from 'src/app/services';
import { ContentService } from 'src/app/services/content/content.service';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.page.html',
  styleUrls: ['./view-all.page.scss'],
})
export class ViewAllPage implements OnInit {
  contentList: Array<any> = [];
  type = '';
  modelData: any;
  isOpen = false;
  playlists: Array<any> = [];
  deleteContent: any;
  @ViewChild(IonModal) modal: IonModal | undefined;
  constructor(
    private contentService: ContentService,
    private router: Router,
    private _modalController: ModalController,
    private headerService: AppHeaderService,
    private playListService: PlaylistService
  ) {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras) {
      this.type = extras.state?.['type'];
    }
  }


  async ngOnInit(): Promise<void> {
  
    if (this.type === 'recentlyviewed') {
      this.getRecentlyviewedContent()
    } else if (this.type === 'playlist') {
      this.getPlaylistContent()
    }
  }

  async getPlaylistContent() {
    await this.playListService.getAllPlayLists('guest').then((result) => {
      if (result) {
        this.playlists = result;
        this.playlists.forEach((e) => {
          e.playListcontentList.map((e: { metaData: string; }) => e.metaData = (typeof e.metaData === 'string') ? JSON.parse(e.metaData) : e.metaData)

        })
      }
      console.log('result......', this.playlists);
    }).catch((error) => {
      console.log('error', error)
    })
  }

  async getRecentlyviewedContent() {
    await this.contentService.getRecentlyViewedContent('guest').then((result) => {
      console.log('getRecentlyviewedContent', result)
      this.contentList = result;
      this.contentList.map((e: { metaData: string; }) => e.metaData = (typeof e.metaData === 'string') ? JSON.parse(e.metaData) : e.metaData)
    }).catch((err) => {
      console.log('error', err)
    })
  }


  createList() {
    this.router.navigate(['/create-playlist'])
  }

  confirm(event: any) {
    this.modal?.dismiss()
    this.isOpen = false;
    switch (event) {
      case 'remove':
        console.log('event', event);
        break;
      case 'delete':
        this.deletePlaylist();
        console.log('delete', event)  
        break;
      default:
        break;
    }
  }

  async deletePlaylist() {
    let contentIds = this.deleteContent.playListcontentList.map((e: { identifier: any; }) => e.identifier)
    console.log('llllllllll', contentIds)
    await this.playListService.deleteContentFromPlayList(this.deleteContent.identifier, contentIds).then((data) => {
      this.getPlaylistContent()
    })
  }

  ionViewWillEnter() {
    this.headerService.showHeader('PlayLists', true);
    this.getPlaylistContent();
  }


  openModal(content?: any) {
    this.isOpen = true;
    this.deleteContent = content;
  }

  viewPlaylists() {
    this.router.navigate(['/play-list'])
  }

}
