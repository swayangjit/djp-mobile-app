import { Component, ViewChild } from '@angular/core';
import { IonTabs, Platform } from '@ionic/angular';
import { AppHeaderService } from '../services/app-header.service';
import { OnTabViewWillEnter } from './on-tabs-view-will-enter';
import { Router } from '@angular/router';
import { TabsService } from '../services/tabs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnTabViewWillEnter{
  subscription: any;
  @ViewChild('tabRef', { static: false }) tabRef!: IonTabs;
  constructor(private platform: Platform,
    private headerService: AppHeaderService,
    private router: Router,
    private tabService: TabsService) {
    this.headerService.showStatusBar();
  }

  tabViewWillEnter(): void {
    this.tabService.show();
  }

  // Prevent back naviagtion
  ionViewDidEnter() {
    this.tabService.show()
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
    }
  )}

  ionViewWillEnter() {
    if (this.tabRef.outlet.component['tabViewWillEnter']) {
      (this.tabRef.outlet.component as unknown as OnTabViewWillEnter).tabViewWillEnter();
    }
  }
  
  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ionTabsDidChange(event: any) {
    if(event.tab == 'story') {
      this.tabService.hide();
      this.router.navigate(['/story'])
    } else if(event.tab == 'parent-sakhi') {
      this.tabService.hide();
      this.router.navigate(['/parent-sakhi'])
    } else if(event.tab == 'teacher-sakhi') {
      this.tabService.hide();
      this.router.navigate(['/teacher-sakhi'])
    }
  }
}
