import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AppHeaderService } from 'src/app/services';
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';

@Component({
  selector: 'app-parent-sakhi',
  templateUrl: './parent-sakhi.page.html',
  styleUrls: ['./parent-sakhi.page.scss'],
})
export class ParentSakhiPage implements OnInit, OnDestroy {
  config: any;
  cdata:  any;
  duration: any;
  constructor(private headerService: AppHeaderService,
    private router: Router,
    private platform: Platform,
    private telemetry: TelemetryGeneratorService) {}

  ngOnInit() {
    this.config = {type: 'parent'}
    this.platform.backButton.subscribeWithPriority(11, async () => {
      this.handleBotEvent();
    });
  }
  
  tabViewWillEnter(): void {
    this.ionViewWillEnter();
  }
  
  ionViewWillEnter()  {
    this.config = {type: 'parent'}
    this.headerService.showHeader("Parent Tara", true, ['bot']);
    this.headerService.showStatusBar(false, '#FCB915');
  }

  handleBotEvent(event?: any) {
    if (event) {
      this.cdata = {
        "audioMessagesCount": event.audio,
        "textMessagesCount": event.text
      }
      this.duration = event.duration;
    }
    this.router.navigate(['/tabs/home']);
  }

  ngOnDestroy() {
    this.telemetry.generateEndTelemetry('bot', 'end', 'parent-sakhi', 'parent-sakhi', undefined, undefined, undefined, this.duration, this.cdata); 
  }
}
