import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services';
import { AppHeaderService } from 'src/app/services/app-header.service';
import { ContentService } from 'src/app/services/content/content.service';
import { PlayList } from 'src/app/services/playlist/models/playlist.content';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';

@Component({
  selector: 'app-mypitara',
  templateUrl: 'mypitara.page.html',
  styleUrls: ['mypitara.page.scss']
})
export class MyPitaraPage {
  contentList: any;
  playlists: Array<any> = [];

  constructor(private headerService: AppHeaderService, 
    private utilService: UtilService,
    private contentService: ContentService,
    private router: Router,
    private playListService: PlaylistService) {
    this.headerService.showHeader(this.utilService.translateMessage("My Pitara"));
  }

  async ngOnInit(): Promise<void> {
    this.headerService.deviceBackbtnEmitted$.subscribe((event: any) => {
      if(event.name = "backBtn") {
        this.getPlaylistContent();
      }
    })
  
  }

  ionViewWillEnter() {
    this.getRecentlyviewedContent();
    this.getPlaylistContent();
  }

  viewAllCards(event: string) {
    this.router.navigate(['/view-all'], {state: {type: event}})
  }

  async getPlaylistContent() {
    this.playlists = [];
    await this.playListService.getAllPlayLists('guest').then((result: Array<PlayList>) => {
      // if (result) {
      //   result.forEach((e) => {
      //     e.playListcontentList.map((e: { metaData: string; }) => e.metaData = (typeof e.metaData === 'string') ? JSON.parse(e.metaData) : e.metaData)
      //     if (e.playListcontentList.length && this.playlists.length < 8) {
      //       e.playListcontentList.forEach((e : any) => this.playlists.push(e))
      //     }
      //   })
      // }
      this.playlists = result;
      console.log('playlists', this.playlists);
    }).catch((error) => {
      console.log('error', error)
    })
  }

  async getRecentlyviewedContent() {
    await this.contentService.getRecentlyViewedContent('guest').then((result) => {
      this.contentList = result;
      console.log('contentList', this.contentList);
      
      // this.contentList.map((e: { metaData: string; }) => e.metaData = (typeof e.metaData === 'string') ? JSON.parse(e.metaData) : e.metaData)
    }).catch((err) => {
      console.log('error', err)
    })
  }
  

}
