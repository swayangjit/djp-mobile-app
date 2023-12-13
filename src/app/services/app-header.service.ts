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

  private deviceBackbtnConfig = new Subject<any>();
  deviceBackbtnEmitted$ = this.deviceBackbtnConfig.asObservable();
  private filterConfig = new Subject<any>();
  filterConfigEmitted$ = this.filterConfig.asObservable();

  private sideMenuItemEvent = new Subject<any>();
  sideMenuItemEventEmitted$ = this.sideMenuItemEvent.asObservable();

  filterEvent(filter: any) {
    this.filterConfig.next(filter);
  }

  sidebarEvent(name: any) {
    this.headerEvent.next(name);
  }

  sideMenuItemEvents($event: any) {
    this.sideMenuItemEvent.next($event);
  }
  
  updatePageConfig(config: any) {
    this.headerConfig.next(config);
  }

  deviceBackBtnEvent(config: any) {
    this.deviceBackbtnConfig.next(config)
  }

  async hideHeader() {
    const defaultConfig = this.getDefaultPageConfig();
    defaultConfig.showHeader = false;
    this.updatePageConfig(defaultConfig);
  }

  getDefaultPageConfig() {
    const defaultConfig: HeaderConfig = {
      showHeader: true,
      pageTitle: 'Title',
      showbackButton: false
    };
    return defaultConfig;
  }

  async showHeader(pageTitle?: string, backbutton?: boolean) {
    const defaultConfig = this.getDefaultPageConfig();
    defaultConfig.pageTitle = pageTitle ? pageTitle : 'Title';
    defaultConfig.showbackButton = backbutton ?? false;
    this.updatePageConfig(defaultConfig);
  }

  hideStatusBar() {
    StatusBar.hide();
  }

  showStatusBar() {
    StatusBar.show({animation: Animation.None});
    StatusBar.setStyle({style: Style.Light});
    StatusBar.setBackgroundColor({color: '#00000'})
    StatusBar.setOverlaysWebView({overlay: true})
  }
}
