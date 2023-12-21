import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderService } from 'src/app/services';
import { TelemetryGeneratorService } from 'src/app/services/telemetry/telemetry.generator.service';

@Component({
  selector: 'app-teacher-sakhi',
  templateUrl: './teacher-sakhi.page.html',
  styleUrls: ['./teacher-sakhi.page.scss'],
})
export class TeacherSakhiPage implements OnInit {
  config: any;
  constructor(private headerService: AppHeaderService,
    private router: Router,
    private telemetry: TelemetryGeneratorService) {}

  ngOnInit() {}
  
  tabViewWillEnter(): void {
    this.ionViewWillEnter();
  }
  
  ionViewWillEnter()  {
    this.config = {type: 'teacher'}
    this.headerService.showHeader("Teacher Sakhi", true, ['bot']);
    this.headerService.showStatusBar(false, '#FCB915');
    this.telemetry.generateStartTelemetry('bot', 'teacher-sakhi');
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
    this.telemetry.generateEndTelemetry('bot', 'end', 'teacher-sakhi', 'teacher-sakhi', undefined, undefined, cdata);
    this.router.navigate(['/tabs/home']);
  }
}
