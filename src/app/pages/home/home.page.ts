import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRefresher } from '@ionic/angular';
import { ContentSrc} from '../../../app/appConstants';
import { AppHeaderService, CachingService, DbService, PreprocessorService, UtilService } from '../../../app/services';
import { Share } from "@capacitor/share";
import { ContentService } from 'src/app/services/content/content.service';
import { PlaylistService } from 'src/app/services/playlist/playlist.service';
import { ConfigService } from '../../../app/services/config.service';
import { SunbirdPreprocessorService } from '../../services/sources/sunbird-preprocessor.service';
import { ModalController } from '@ionic/angular';
import { LangaugeSelectComponent } from 'src/app/components/langauge-select/langauge-select.component';
import { Filter, Language, Mapping, MappingElement, MetadataMapping, SourceConfig } from 'src/app/services/config/models/config';
import { Content } from 'src/app/services/content/models/content';
import { SheetModalComponent } from 'src/app/components/sheet-modal/sheet-modal.component';
import { NetworkService } from 'src/app/services/network.service';

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
  networkConnected: boolean = false;
  constructor(
    private headerService: AppHeaderService,
    private utilService: UtilService,
    private router: Router,
    private contentService: ContentService,
    private playListService: PlaylistService,
    private configService: ConfigService,
    private sunbirdProcess: SunbirdPreprocessorService,
    private preprocessor: PreprocessorService,
    private modalCtrl: ModalController,
    private networkService: NetworkService,
    private cacheService: CachingService) {
      this.configContents = [];
      // this.contentService.saveContents(this.contentList)
      this.networkService.networkConnection$.subscribe(ev => {
        console.log(ev);
        this.networkConnected = ev;
      })
    }
    
  async ngOnInit(): Promise<void> {  
    this.preprocessor.sourceProcessEmitted$.subscribe(async (content: any) => {
      console.log('content form preprocessor ', content);
      await this.contentService.deleteAllContents()
      this.contentService.saveContents(content).then()
      if(content.length > 0) {
        content.forEach((ele: any) => {
          this.configContents.push(ele)
        });
        console.log("configContents ", this.configContents);
      }
    })
    let forceRefresh = await this.cacheService.getCacheTimeout();
    if(forceRefresh) {
      this.getServerMetaConfig();
    } else if(!this.networkConnected) {
      this.configContents = [];
      this.configContents = await this.contentService.getAllContent();
      if (this.configContents.length == 0) this.getServerMetaConfig();
    } else {
      this.getServerMetaConfig();
    }
  }

  async getServerMetaConfig() {
    let config = await this.configService.getConfigMeta();
    this.initialiseSources(config.sourceConfig, config.metadataMapping);
    this.filters = config.filters.sort((a: Filter, b: Filter) => a.index - b.index);
    this.filters[0].active = true;
    this.languages = config.languages.sort((a: Language, b: Language) => a.identifier.localeCompare(b.identifier));
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

  async moreOtions(content: any) {
    const modal = await this.modalCtrl.create({
      component: SheetModalComponent,
      componentProps: {
        content: content
      },
      cssClass: 'sheet-modal',
      breakpoints: [0.3],
      showBackdrop: false,
      initialBreakpoint: 0.3,
      handle: false,
      handleBehavior: "none"
    });
    await modal.present();

    modal.onDidDismiss().then((_ => {
    }));
  }
  initialiseSources(sourceConfig: SourceConfig, mapping: MetadataMapping) {
    const mappingList = mapping.mappings;
    if(sourceConfig.sources && sourceConfig.sources.length > 0) {
      sourceConfig.sources.forEach((config: any) => {
        if(config.sourceType == 'sunbird') {
        const mappingElement: MappingElement | undefined  = mappingList.find((element) => element.sourceType == 'sunbird') ;
          this.sunbirdProcess.process(config, mappingElement);
        }
      });
    }
  }

  async playContent(event: Event, content: Content) {
    this.contentService.markContentAsViewed(content)
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
