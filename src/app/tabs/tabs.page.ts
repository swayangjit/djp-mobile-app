import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppHeaderService } from '../services/app-header.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  subscription: any;
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
  
  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
