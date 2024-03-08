import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderService, LocalNotificationService } from 'src/app/services';
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
  notification: any;
  notifSubscription: any;
  constructor(private headerService: AppHeaderService,
    private router: Router,
    private telemetry: TelemetryGeneratorService,
    private localNotification: LocalNotificationService) {
      let extras = this.router.getCurrentNavigation()?.extras
      if(extras) {
        this.notification = extras?.state?.['notif'];
      }
    }

  ngOnInit() {
    this.config = this.notification ? {type: 'parent', notif: this.notification} : {type: 'parent'}
  }
  
  tabViewWillEnter(): void {
    this.ionViewWillEnter();
  }
  
  ionViewWillEnter()  {
    this.config = this.notification ? {type: 'parent', notif: this.notification} : {type: 'parent'};
    this.headerService.showHeader("Parent Tara", true, ['bot']);
    this.headerService.showStatusBar(false, '#FCB915');
  }

  ngAfterViewInit() {
    this.notifSubscription = this.localNotification.notificationEventEmitted$.subscribe((notif: any) => {
      this.config = {type: 'parent', notif: notif, notification: true}
    });
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
