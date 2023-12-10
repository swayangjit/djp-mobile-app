import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRefresher } from '@ionic/angular';
import { ContentSrc, Filter, Language } from '../../../app/appConstants';
import { AppHeaderService, DikshaPreprocessorService, PreprocessorService, UtilService } from '../../../app/services';
import { Share } from "@capacitor/share";
import { ContentService } from 'src/app/services/content/content.service';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';
import { ConfigService } from '../../../app/services/config.service';
import { SunbirdPreprocessorService } from '../../services/sources/sunbird-preprocessor.service';
import { ModalController } from '@ionic/angular';
import { LangaugeSelectComponent } from 'src/app/components/langauge-select/langauge-select.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  refresh: boolean = false;
  // contents!: Array<Content>
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

  contents!: Array<ContentSrc>;
  filters!: Array<Filter>
  languages!: Array<Language>
  isOpen: boolean = false;
  configContents!: Array<any>;
  @ViewChild('refresher', { static: false }) refresher!: IonRefresher;
  constructor(
    private headerService: AppHeaderService,
    private utilService: UtilService,
    private router: Router,
    private contentService: ContentService,
    private playListService: PlaylistService,
    private configService: ConfigService,
    private sunbirdProcess: SunbirdPreprocessorService,
    private dikshaProcess: DikshaPreprocessorService,
    private preprocessor: PreprocessorService,
    private modalCtrl: ModalController) {
      this.configContents = [];
      this.contents = [{name: "pdf content", liked: false, type:'pdf'}, {name: "video content", liked: false, type:'video'}]
      // this.contentService.saveContents(this.contentList)
    }
    
  async ngOnInit(): Promise<void> {  
    this.preprocessor.sourceProcessEmitted$.subscribe((content: any) => {
      console.log('content form preprocessor ', content);
      if(content.length > 0) {
        content.forEach((ele: any) => {
          this.configContents.push(ele)
        });
        console.log("configContents ", this.configContents);
      }
    })
    let res = await this.configService.getConfigMeta();
    this.initialiseSources(res.sourceConfig);
    this.filters = res.filters.sort((a: Filter, b: Filter) => a.index - b.index);
    this.filters[0].active = true;
    this.languages = res.languages.sort((a: Language, b: Language) => a.identifier.localeCompare(b.identifier));
  }

  async ionViewWillEnter() {
    this.headerService.headerEventEmitted$.subscribe((event: any) => {
      if(event.name = "profile") {
        this.presentModal()
      }
    })
    this.headerService.showHeader(this.utilService.translateMessage('Title'));
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: LangaugeSelectComponent,
      componentProps: {
        languages: this.languages
      },
      cssClass: 'lang-modal',
      breakpoints: [0.3],
      initialBreakpoint: 0.3,
      handle: false,
      handleBehavior: "none"
    });
    await modal.present();

    modal.onDidDismiss().then((_ => {
    }));
  }

  initialiseSources(data: any) {
    console.log('data', data);
    
    if(data.sources && data.sources.length > 0) {
      data.sources.forEach((config: any) => {
        if(config.sourceType == 'sunbird') {
          this.sunbirdProcess.process(config);
        } 
        this.dikshaProcess.process(config);
      });
    }
  }

  async playContent(event: Event, content: ContentSrc) {
    await this.router.navigate(['/player'], {state: {content}});
  }

  contentLiked(event: Event, content: ContentSrc) {
    if(event) {
      content.liked = true;
    }
  }

  async shareContent(event: Event, content: ContentSrc) {
    if((await Share.canShare()).value) {
      Share.share({text: content.name});
    }
  }

  addContentToMyPitara(event: Event, content: ContentSrc) {
  }

  doRefresh(refresher: any) {
    this.refresh = true;
    setTimeout(() => {
      this.refresh = false;
      if (refresher) {
        refresher.detail.complete();
      }
    }, 100);
  }

  handleFilter(filter: any) {
    alert('handle filter '+  filter);
  }
}
