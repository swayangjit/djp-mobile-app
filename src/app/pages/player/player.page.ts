import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderService } from 'src/app/services';
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Location } from '@angular/common';
import { playerConfig, videoConfig } from './playerData';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {
  content: any;
  orientationType: string = "";
  playerConfig: any;
  videoConfig: any;
  playerType: string = '';

  @ViewChild('pdf') pdf!: ElementRef;
  @ViewChild('video') video!: ElementRef;
  constructor(private router: Router,
    private headerService: AppHeaderService,
    private location: Location,) { 
    let extras = this.router.getCurrentNavigation()?.extras;
    if(extras) {
      this.content = extras.state?.['content'];
      this.playerType = this.content.type;
    }
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
      ScreenOrientation.lock({orientation: 'landscape-primary'});
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
      } else if(this.playerType == "video") {
          const videoplayerConfig  = this.videoConfig;
          const epubElement  =  document.createElement('sunbird-video-player');
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
  }

  ionViewWillLeave() {
    if (this.orientationType == "landscape-primary" || this.orientationType == "landscape-secondary") {
      this.orientationType = 'portrait-primary';
      ScreenOrientation.unlock();
      ScreenOrientation.lock({orientation: 'portrait-primary'});
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
    if(event?.detail?.edata?.type) {
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
