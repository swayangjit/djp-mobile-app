import { Component, ViewChild } from '@angular/core';
import { IonTabs, Platform } from '@ionic/angular';
import { AppHeaderService } from '../services/app-header.service';
import { OnTabViewWillEnter } from './on-tabs-view-will-enter';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  subscription: any;
  @ViewChild('tabRef', { static: false }) tabRef!: IonTabs;
  constructor(private platform: Platform,
    private headerService: AppHeaderService) {
    this.headerService.showStatusBar();
  }

  // Prevent back naviagtion
  ionViewDidEnter() {
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
}
