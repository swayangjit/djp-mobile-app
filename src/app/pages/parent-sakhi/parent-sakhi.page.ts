import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BotMessage } from 'src/app/appConstants';
import { AppHeaderService } from 'src/app/services';
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';

@Component({
  selector: 'app-parent-sakhi',
  templateUrl: './parent-sakhi.page.html',
  styleUrls: ['./parent-sakhi.page.scss'],
})
export class ParentSakhiPage implements OnInit {
  config: any;
  messages: Array<BotMessage> = [];
  constructor(private headerService: AppHeaderService,
    private router: Router,
    private telemetry: TelemetryGeneratorService) {
      this.messages = []
    }

  ngOnInit() {
  }
  
  tabViewWillEnter(): void {
    this.ionViewWillEnter();
  }
  
  ionViewWillEnter()  {
    this.config = {type: 'parent'}
    this.headerService.showHeader("Parent Sakhi", true, ['bot']);
    this.headerService.showStatusBar('#FFBC00');
    this.telemetry.generateStartTelemetry('bot', 'parent-sakhi');
  }

  handleBotEvent(event: any) {
    let cdata = [{
      'id': event.totalCount,
      'type': 'Message total count'
      },
      {
      'id': event.audio,
      'type': 'audio count'
      },
      {
      'id': event.text,
      'type': 'text message count'
    }]
    this.telemetry.generateEndTelemetry('bot', 'end', 'parent-sakhi', 'parent-sakhi', undefined, undefined, cdata);
    this.router.navigate(['/tabs/home']);
  }
}
