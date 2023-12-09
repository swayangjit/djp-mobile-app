import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRefresher } from '@ionic/angular';
import { Content } from 'src/app/appConstants';
import { AppHeaderService, UtilService } from 'src/app/services';
import { Share } from "@capacitor/share";
import { ContentService } from 'src/app/services/content/content.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  refresh: boolean = false;
  contents!: Array<Content>
  contentList: Array<any> = [
    {
      source: 'sunbird',
      sourceType:'Diksha',
      metaData: {
        identifier: 'do_123',
        name: '',
        thumbnail: '',
        description: '',
        mimeType: '',
        url: '',
        focus: '',
        keyword: '',
      }
  
    }
  ]

  @ViewChild('refresher', { static: false }) refresher!: IonRefresher;
  constructor(
    private headerService: AppHeaderService,
    private utilService: UtilService,
    private router: Router,
    private contentService: ContentService) {
      this.contents = [{name: "pdf content", liked: false, type:'pdf'}, {name: "video content", liked: false, type:'video'}]
      // this.contentService.saveContents(this.contentList)
    }
    
  async ngOnInit(): Promise<void> {
    this.headerService.showHeader(this.utilService.translateMessage('Jaadui Pitara'));
    this.contentService.getRecentlyViewedContent('guest').then((result) => {
      console.log('result', result)
    })
  }

  async playContent(event: Event, content: Content) {
    this.contentService.markContentAsViewed(this.contentList[0])
    await this.router.navigate(['/player'], {state: {content}});
  }

  contentLiked(event: Event, content: Content) {
    if(event) {
      content.liked = true;
    }
  }

  async shareContent(event: Event, content: Content) {
    if((await Share.canShare()).value) {
      Share.share({text: content.name});
    }
  }

  addContentToMyPitara(event: Event, content: Content) {
    
  }
}
