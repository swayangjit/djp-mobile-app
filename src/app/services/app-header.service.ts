import { Injectable } from '@angular/core';
import { Animation, StatusBar, Style } from '@capacitor/status-bar';
import { Subject } from 'rxjs/internal/Subject';
import { UtilService } from './util.service';
import { HeaderConfig } from '../appConstants';

@Injectable({
  providedIn: 'root'
})
export class AppHeaderService {
  constructor(private utilService: UtilService) { }
  private headerEvent = new Subject<any>();
  headerEventEmitted$ = this.headerEvent.asObservable();

  private headerConfig = new Subject<any>();
  headerConfigEmitted$ = this.headerConfig.asObservable();

  private sideMenuItemEvent = new Subject<any>();
  sideMenuItemEventEmitted$ = this.sideMenuItemEvent.asObservable();

  sidebarEvent(name: any) {
    this.headerEvent.next(name);
  }

  sideMenuItemEvents($event: any) {
    this.sideMenuItemEvent.next($event);
  }
  
  updatePageConfig(config: any) {
    this.headerConfig.next(config);
  }

  async hideHeader() {
    const defaultConfig = this.getDefaultPageConfig();
    defaultConfig.showHeader = false;
    this.updatePageConfig(defaultConfig);
  }

  getDefaultPageConfig() {
    const defaultConfig: HeaderConfig = {
      showHeader: true,
      pageTitle: this.utilService.translateMessage('Title'),
      showbackButton: false
    };
    return defaultConfig;
  }

  async showHeader(pageTitle?: string, backbutton?: boolean) {
    const defaultConfig = this.getDefaultPageConfig();
    defaultConfig.pageTitle = pageTitle ? pageTitle : this.utilService.translateMessage('Title');
    defaultConfig.showbackButton = backbutton ?? false;
    this.updatePageConfig(defaultConfig);
  }

  hideStatusBar() {
    StatusBar.hide();
  }

  showStatusBar() {
    StatusBar.show({animation: Animation.None});
    StatusBar.setStyle({style: Style.Dark});
    StatusBar.setBackgroundColor({color: '#FFFFFF'})
    StatusBar.setOverlaysWebView({overlay: true})
  }
}
