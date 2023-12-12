import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderService } from '../../../app/services';
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Location } from '@angular/common';
import { playerConfig, videoConfig } from './playerData';
import { Content } from 'src/app/services/content/models/content';
import { DomSanitizer } from '@angular/platform-browser';
declare var Plyr:any;
@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {
  content?: Content;
  orientationType: string = "";
  playerConfig: any;
  videoConfig: any;
  playerType: string = '';
  srcUrl: any;
  @ViewChild('pdf') pdf!: ElementRef;
  @ViewChild('video') video!: ElementRef;
  constructor(private router: Router,
    private headerService: AppHeaderService,
    private location: Location,
    private domSanitiser: DomSanitizer) {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras) {
      this.content = extras.state?.['content'] as Content;
      this.playerType = this.getPlayerType(this.content.metaData.mimeType);
      this.srcUrl = this.domSanitiser.bypassSecurityTrustResourceUrl(this.content.metaData.url);
    }
  }

  private getPlayerType(mimeType: string): string {
    if (mimeType == 'application/pdf') {
      return 'pdf'
    } else if (mimeType == 'video/mp4') {
      return 'video'
    } else if(mimeType == 'video/x-youtube') {
      return 'youtube'
    }
    return ''
  }

  ngOnInit() {
    this.headerService.hideHeader();
    this.headerService.hideStatusBar();
    this.playerConfig = playerConfig;
    this.videoConfig = videoConfig;
  }

  async ngAfterViewInit() {
    this.orientationType = await (await ScreenOrientation.orientation()).type
    if (this.orientationType == "portrait-primary" || this.orientationType == "portrait-secondary") {
      this.orientationType = 'landscape-primary';
      ScreenOrientation.unlock();
      ScreenOrientation.lock({ orientation: 'landscape-primary' });
      if (this.playerType == 'pdf') {
        const playerConfig = this.playerConfig;
        const pdfElement = document.createElement('sunbird-pdf-player');
        pdfElement.setAttribute('player-config', JSON.stringify(playerConfig));
        pdfElement.addEventListener('playerEvent', (event) => {
          console.log("On playerEvent", event);
          this.playerEvents(event);
        });
        pdfElement.addEventListener('telemetryEvent', (event) => {
          console.log("On telemetryEvent", event);
          this.playerTelemetryEvents(event);
        });
        this.pdf.nativeElement.append(pdfElement);
      } else if (this.playerType == "video") {
        const videoplayerConfig = this.videoConfig;
        const epubElement = document.createElement('sunbird-video-player');
        epubElement.setAttribute('player-config', JSON.stringify(videoplayerConfig));
        epubElement.addEventListener('playerEvent', (event) => {
          console.log("On playerEvent", event);
          this.playerEvents(event);
        });
        epubElement.addEventListener('telemetryEvent', (event) => {
          console.log("On telemetryEvent", event);
          this.playerTelemetryEvents(event);
        });
        this.video.nativeElement.append(epubElement);
      }
    }
    const player = new Plyr('#player', {autoplay: true});
    console.log('player ', player);
  }

  ionViewWillLeave() {
    if (this.orientationType == "landscape-primary" || this.orientationType == "landscape-secondary") {
      this.orientationType = 'portrait-primary';
      ScreenOrientation.unlock();
      ScreenOrientation.lock({ orientation: 'portrait-primary' });
    }
    this.headerService.showHeader();
    this.headerService.showStatusBar();
  }

  playerTelemetryEvents(event: any) {
  }

  closePlayer() {
    this.location.back();
  }

  playerEvents(event: any) {
    if (event?.detail?.edata?.type) {
      let type = event?.detail?.edata?.type
      switch (type) {
        case "EXIT":
          this.location.back();
          break;
        default:
          break;
      }
    }
  }
}
