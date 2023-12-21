import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppHeaderService } from '../../../app/services';
import { Router } from '@angular/router';
import { OnTabViewWillEnter } from 'src/app/tabs/on-tabs-view-will-enter';
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';

@Component({
  selector: 'app-story',
  templateUrl: 'story.page.html',
  styleUrls: ['story.page.scss']
})
export class StoryPage implements OnInit, OnTabViewWillEnter, OnDestroy{
  config: any;
  cdata: any;
  duration: any;
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
      this.headerService.showStatusBar(false, '#CF4147');
    }

    handleBotEvent(event: any) {
      console.log('event bot ', event );
      this.cdata = {
        "audioMessagesCount": event.audio,
        "textMessagesCount": event.text
      }
      this.duration = event.duration;
      this.router.navigate(['/tabs/home']);
    }
    
    ngOnDestroy() {
      this.telemetry.generateEndTelemetry('bot', 'end', 'story-sakhi', 'story-sakhi', undefined, undefined, undefined, this.duration, this.cdata);
    }
}
