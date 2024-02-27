import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Subject } from 'rxjs';
import { TabsService } from './tabs.service';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {
  private notifEvent = new Subject<any>();
  notificationEventEmitted$ = this.notifEvent.asObservable();

  constructor(
    private router: Router,
    private tabService: TabsService
  ) { }

  async initializeLocalNotif(notificationConfig: any) {
    let that = this;
    try {
      let res = await LocalNotifications.checkPermissions()
      if(res.display !== 'granted') {
        await LocalNotifications.requestPermissions();
      }
      let option: ScheduleOptions = {
        notifications: [ notificationConfig ],
      }
      await LocalNotifications.schedule(option);
    }
    catch(e) {
      console.log("Error on local notification ", e);
    }

    await LocalNotifications.addListener('localNotificationActionPerformed', (async notif => {
      let location = that.router['location']._locationStrategy._platformLocation._location;
      if(location.pathname !== '/parent-sakhi') {
        console.log("router page ", location.pathname);
        that.tabService.hide();
        if(location.pathname === '/') {
          setTimeout(async () => {
            await that.router.navigate(['/parent-sakhi'], {state: {notif: notif.notification}})
          }, 3000);
        } else {
          await that.router.navigate(['/parent-sakhi'], {state: {notif: notif.notification}})
        }
      } else {
        this.notifEvent.next(notif.notification);
      }
    }))
  }

  async cancelNotification(id: number) {
    try {
      await LocalNotifications.cancel({notifications: [{id}]})
    }
    catch(e) {
      console.log("Error on cancel local notification ", e);
    }
  }
}
