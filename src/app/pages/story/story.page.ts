import { Component, OnInit } from '@angular/core';
import { AppHeaderService } from '../../../app/services';
import { Router } from '@angular/router';
import { BotMessage } from 'src/app/appConstants';
import { OnTabViewWillEnter } from 'src/app/tabs/on-tabs-view-will-enter';
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';

@Component({
  selector: 'app-story',
  templateUrl: 'story.page.html',
  styleUrls: ['story.page.scss']
})
export class StoryPage implements OnInit, OnTabViewWillEnter{
  config: any;
  constructor(private headerService: AppHeaderService,
    private router: Router,
    private telemetry: TelemetryGeneratorService) {}
    
    ngOnInit() {}
    
    tabViewWillEnter(): void {
      this.ionViewWillEnter();
    }
    
    ionViewWillEnter()  {
      this.config = {type: 'story'}
      this.headerService.showHeader("Story Sakhi", true, ['bot']);
      this.headerService.showStatusBar('#FF3B53');
      this.telemetry.generateStartTelemetry('bot', 'story-sakhi');
    }

    handleBotEvent(event: any) {
      console.log('event bot ', event );
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
      this.telemetry.generateEndTelemetry('bot', 'end', 'story-sakhi', 'story-sakhi', undefined, undefined, cdata);
      this.router.navigate(['/tabs/home']);
    }
}
