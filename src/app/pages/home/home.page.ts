import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRefresher } from '@ionic/angular';
import { Searchrequest, PlayerType, PageId, Content, ContentMetaData } from '../../../app/appConstants';
import { AppHeaderService, CachingService, PreprocessorService, SearchService, StorageService } from '../../../app/services';
import { ContentService } from 'src/app/services/content/content.service';
import { ConfigService } from '../../../app/services/config.service';
import { SunbirdPreprocessorService } from '../../services/sources/sunbird-preprocessor.service';
import { ModalController } from '@ionic/angular';
import { Filter, Language, MappingElement, MetadataMapping, SourceConfig } from 'src/app/services/config/models/config';
import { SheetModalComponent } from 'src/app/components/sheet-modal/sheet-modal.component';
import { NetworkService } from 'src/app/services/network.service';
import { AddToPitaraComponent } from 'src/app/components/add-to-pitara/add-to-pitara.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OnTabViewWillEnter } from 'src/app/tabs/on-tabs-view-will-enter';
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';
import { TelemetryObject } from 'src/app/services/telemetry/models/telemetry';
import confetti from 'canvas-confetti';
import { NativeAudio } from '@capacitor-community/native-audio';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnTabViewWillEnter, OnDestroy {
  refresh: boolean = false;
  showSheenAnimation: boolean = true;
  contentList: Array<Content> = []
  filters!: Array<Filter>
  languages!: Array<Language>
  isOpen: boolean = false;
  configContents!: Array<any>;
  optModalOpen: boolean = false;
  @ViewChild('refresher', { static: false }) refresher!: IonRefresher;
  networkConnected: boolean = false;
  mimeType = PlayerType;
  noSearchData: boolean = false;
  langChangeSubscription: Subscription | null = null;
  constructor(
    private headerService: AppHeaderService,
    private router: Router,
    private contentService: ContentService,
    private configService: ConfigService,
    private sunbirdProcess: SunbirdPreprocessorService,
    private preprocessor: PreprocessorService,
    private modalCtrl: ModalController,
    private networkService: NetworkService,
    private cacheService: CachingService,
    private domSanitiser: DomSanitizer,
    private storage: StorageService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private searchService: SearchService,
    private translateService: TranslateService) {
    this.configContents = [];
    this.networkService.networkConnection$.subscribe(ev => {
      console.log(ev);
      this.networkConnected = ev;
    })
  }
  ngOnDestroy(): void {
    try {
      this.langChangeSubscription && this.langChangeSubscription.unsubscribe()  
    } catch (error) {
      console.log(`error in unsubscribe`, error)
    }
    
  }

  async ngOnInit(): Promise<void> {

    this.langChangeSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.showSheenAnimation = true;
      this.getServerMetaConfig();
    });

    let req: Searchrequest = {
      request: {
        pageId: '',
        query: undefined,
        filters: undefined
      }
    }
    // main content config and filter
    this.headerService.filterConfigEmitted$.subscribe(async (val: any) => {
      req.request.pageId = PageId.HOME;
      req.request.query = val.defaultFilter.query;
      req.request.filters = val.defaultFilter.filters;
      let content: Array<ContentMetaData> = await this.configService.getAllContent(req);
      console.log('content', content);
      this.mappUIContentList(content);
    })
    // side bar menu and filter chip events
    this.headerService.sideMenuItemEventEmitted$.subscribe(async (val: any) => {
      console.log(val);
      this.showSheenAnimation = true;
      try {
        let res: any = await this.searchService.postContentSearch({ query: val.query, filter: val.filter });
        console.log('Response', res);
        this.mappUIContentList(res);

      }
      catch (e) {
        console.log('error', e);
      }
    })
    this.networkConnected = await this.networkService.getNetworkStatus()
    let forceRefresh = await this.cacheService.getCacheTimeout();
    if (forceRefresh) {
      this.getServerMetaConfig();
    } else if (!this.networkConnected) {
      this.configContents = [];
      this.configContents = await this.contentService.getAllContent();
      if (this.configContents.length == 0) this.getServerMetaConfig();
      this.showSheenAnimation = false;
    } else {
      this.getServerMetaConfig();
      this.configContents = [];
      let content = await this.contentService.getAllContent();
      this.configContents = content;
      this.showSheenAnimation = false;
    }
    await NativeAudio.preload({
      assetPath: 'public/assets/sounds/windchime.mp3',
      assetId: 'windchime',
      volume: 1.0,
      audioChannelNum: 1,
      isUrl: false
    })
  }

  async mappUIContentList(content: Array<ContentMetaData>) {
    await this.contentService.deleteAllContents();
    this.showSheenAnimation = false;
    this.configContents = [];
    if (content.length > 0) {
      this.noSearchData = false;
      console.log('content ', content);
      let list: any = {};
      content.forEach((ele: any, i: number) => {
        list = {}
        list.source = 'djp'
        list.sourceType = 'djp-content'
        list.metaData = ele
        this.configContents.push(list)
      });
      this.contentService.saveContents(this.configContents).then()
    } else {
      this.noSearchData = true;
    }
  }

  async getServerMetaConfig() {
    let meta = await this.storage.getData('configMeta');
    let config = meta ? JSON.parse(meta) : await this.configService.getConfigMeta();
    console.log('config ', config);
    config.pageConfig.forEach((config: any) => {
      this.filters = (config.additionalFilters).sort((a: Filter, b: Filter) => a.index - b.index);
    })
    this.languages = config.languages.sort((a: Language, b: Language) => a.id.localeCompare(b.id));
    this.headerService.filterEvent({ defaultFilter: config.pageConfig[0].defaultFilter, filter: this.filters, languages: this.languages });
  }

  async tabViewWillEnter() {
    await this.headerService.showHeader('Title', false);
  }

  async ionViewWillEnter() {
    this.tabViewWillEnter();
  }

  ionViewDidEnter() {
    this.headerService.showStatusBar(false);
  }

  async moreOtions(content: any) {
    let modal: any;
    if (!this.optModalOpen) {
      this.optModalOpen = true;
      modal = await this.modalCtrl.create({
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
    }

    modal.onDidDismiss().then(async (result: any) => {
      this.optModalOpen = false;
      if (result.data && result.data.type === 'addToPitara') {
        this.addContentToMyPitara(result.data.content || content)
      } else if (result.data && result.data.type == 'like') {
        this.contentService.likeContent(result.data.content || content, 'guest', true)
        if(result.data.content.metaData.isLiked) {
          await NativeAudio.play({
            assetId: 'windchime',
          });
          confetti({
            startVelocity: 30,
            particleCount: 400,
            spread: 360,
            ticks: 60,
            origin: { y: 0.5, x: 0.5 },
            colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
          });
        }
        this.telemetryGeneratorService.generateInteractTelemetry('TOUCH', 'content-liked', 'home', 'home', new TelemetryObject(content?.metaData.identifier!, content?.metaData.mimetype!, ''));
      }
    });
  }

  initialiseSources(sourceConfig: SourceConfig, mapping: MetadataMapping) {
    const mappingList = mapping.mappings;
    if (sourceConfig.sources && sourceConfig.sources.length > 0) {
      sourceConfig.sources.forEach((config: any) => {
        if (config.sourceType == 'sunbird') {
          const mappingElement: MappingElement | undefined = mappingList.find((element) => element.sourceType == 'sunbird');
          this.sunbirdProcess.process(config, mappingElement);
        }
      });
    }
  }

  async playContent(event: Event, content: Content) {
    this.contentService.markContentAsViewed(content)
    this.configContents.forEach(cont => {
      cont.play = false;
    })
    // if(content.metaData.mimetype !== PlayerType.YOUTUBE) {
    await this.router.navigate(['/player'], { state: { content } });
    // } else {
    //   content.play = true;
    //   this.configContents.forEach(cont => {
    //     if (cont.metaData.identifier === content.metaData.identifier) {
    //       cont = content
    //     }
    //   })
    // }
  }

  async addContentToMyPitara(content: Content) {
    const modal = await this.modalCtrl.create({
      component: AddToPitaraComponent,
      componentProps: {
        content
      },
      cssClass: 'add-to-pitara',
      breakpoints: [0, 1],
      showBackdrop: false,
      initialBreakpoint: 1,
      handle: false,
      handleBehavior: "none"
    });
    await modal.present();
    modal.onWillDismiss().then((result) => {
    });
  }

  doRefresh(refresher: any) {
    this.refresh = true;
    this.getServerMetaConfig();
    setTimeout(() => {
      this.refresh = false;
      if (refresher) {
        refresher.detail.complete();
      }
    }, 100);
  }

  handleFilter(filter: any) {
    alert('handle filter ' + filter);
  }

  sanitiseUrl(url: string): SafeResourceUrl {
    let sanitizeUrl = url.split('&')[0]
    return this.domSanitiser.bypassSecurityTrustResourceUrl(sanitizeUrl.replace('watch?v=', 'embed/') + '?autoplay=1&controls=1');
  }

  loadYoutubeImg(id: string): string {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  }

  navigateToSakhi(type: string) {
    this.telemetryGeneratorService.generateStartTelemetry('bot', `${type}-sakhi`);
    if (type == "story") {
      this.router.navigate([`/${type}`]);
    } else if (type == "teacher") {
      this.router.navigate(['/teacher-sakhi'])
    }
  }
}
