import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Content, ContentSrc } from 'src/app/appConstants';
import { SearchService } from 'src/app/services/search.service';
import { AppHeaderService } from 'src/app/services';
import { RecordingService } from 'src/app/services/recording.service';
import { OnTabViewWillEnter } from 'src/app/tabs/on-tabs-view-will-enter';
import { PlayerType } from "../../appConstants";
import { ModalController } from '@ionic/angular';
import { SheetModalComponent } from 'src/app/components/sheet-modal/sheet-modal.component';
import { AddToPitaraComponent } from 'src/app/components/add-to-pitara/add-to-pitara.component';
import { ContentService } from 'src/app/services/content/content.service';
import { Router } from '@angular/router';
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';
import { TelemetryObject } from 'src/app/services/telemetry/models/telemetry';
import { Keyboard } from "@capacitor/keyboard";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnTabViewWillEnter {
  showSheenAnimation: boolean = false;
  @ViewChild('searchInput', { static: false }) searchBar: any;
  searchKeywords: string = "";
  searchContentResult: Array<any> = [];
  optModalOpen: boolean = false;
  mimeType = PlayerType;
  noSearchData: boolean = false;
  onError = false;
  errMsg = "";
  constructor(
    private headerService: AppHeaderService,
    private location: Location,
    private record: RecordingService,
    private tarnslate: TranslateService,
    private searchApi: SearchService,
    private modalCtrl: ModalController,
    private contentService: ContentService,
    private router: Router,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) { }
  
  tabViewWillEnter(): void {
    this.headerService.hideHeader();
    this.headerService.showStatusBar(false);
  }

  ngOnInit() {
    this.record.searchEventRecorded$.subscribe((res: any) => {
      this.handleSearch(res, true);
    })
  }

  navigateBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    this.headerService.hideHeader();
    this.headerService.showStatusBar(false);
  }

  async handleSearch(data?: any, audio: boolean = false) {
    try {
      if(this.searchKeywords.replace(/\s/g, '').length > 0) {
        this.showSheenAnimation = true;
        Keyboard.hide();
        let res = await this.searchApi.postSearchContext({text: audio ? data : this.searchKeywords, currentLang: this.tarnslate.currentLang}, audio);
        if (res.input) {
          this.searchKeywords = res.input.englishText;
          // Content search api call
          let searchRes = await this.searchApi.postContentSearch({query: res.context, filter: ''});
          console.log('searchRes ', searchRes);
          this.telemetryGeneratorService.generateSearchTelemetry(audio ? 'audio': 'text', audio ? '' : this.searchKeywords, searchRes.length, 'search', '' )
          if(searchRes.length > 0) {
            this.showSheenAnimation = false;
            this.noSearchData = false;
            let list: any = {};
            this.searchContentResult = [];
            searchRes.forEach((ele: any) => {
              list = {}
              list.source = 'djp'
              list.sourceType = 'djp-content'
              list.metaData = ele
              this.searchContentResult.push(list)
            });
            this.contentService.saveContents(this.searchContentResult).then()
          } else {
            this.showSheenAnimation = false;
            this.noSearchData = true;
            this.errMsg = "No Result";
          }
        } else {
          this.searchContentResult = [];
          this.showSheenAnimation = false;
          this.noSearchData = true;
          this.errMsg = "Sry, please try again!";
        }
      }
    } catch(e){
      this.showSheenAnimation = false;
      this.noSearchData = true;
      this.searchContentResult = [];
      this.errMsg = "Sry, please try again!"
    }
  }

  async moreOtions(content: any) {
    let modal: any;
    if(!this.optModalOpen) {
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

    modal.onDidDismiss().then((result: any) => {
      this.optModalOpen = false;
      if(result.data && result.data.type === 'addToPitara') {
         this.addContentToMyPitara(result.data.content || content)
      } else if(result.data && result.data.type == 'like') {
        this.telemetryGeneratorService.generateInteractTelemetry('TOUCH', 'content-liked', 'search', 'search', new TelemetryObject(content?.metaData.identifier!, content?.metaData.mimetype!, ''))
      }
    });
  }
  async addContentToMyPitara(content: ContentSrc) {
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

  async playContent(event: Event, content: Content) {
    this.contentService.markContentAsViewed(content)
    await this.router.navigate(['/player'], {state: {content}})
  }
  
  loadYoutubeImg(id: string): string {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  }

  onLongPressStart() {
    console.log('long press on search start');
    this.searchKeywords = "";
    this.record.startRecognition();
  }
  
  onLongPressEnd() {
    console.log('long press on search end');
    this.record.stopRecognition('search');
  }
}
