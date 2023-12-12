import { Component, OnInit, ViewChild } from '@angular/core';
import { AppHeaderService } from './services/app-header.service';
import { HeaderConfig } from './appConstants';
import { TranslateService } from '@ngx-translate/core';
import { IonRouterOutlet } from '@ionic/angular';
import { TelemetryService } from './services';
import { TelemetryAutoSyncService } from './services/telemetry/telemetry.auto.sync.service';
import { combineLatest, mergeMap } from 'rxjs';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  headerConfig!: HeaderConfig;
  @ViewChild('mainContent', { read: IonRouterOutlet, static: false }) routerOutlet!: IonRouterOutlet;
  constructor(private headerService: AppHeaderService,
    private translate: TranslateService,
    private telemetryAutoSyncService: TelemetryAutoSyncService) {
  }

  async ngOnInit() {
    this.headerService.headerConfigEmitted$.subscribe((config: HeaderConfig) => {
      this.headerConfig = config;
    });
    this.translate.addLangs([ 'en', 'hi', 'te']);
    this.autoSyncTelemetry()
    App.addListener('pause', ()=>  this.telemetryAutoSyncService.pause() );
		App.addListener('resume', ()=> this.telemetryAutoSyncService.continue() );
  }

  async handleHeaderEvents($event: Event) {
    this.headerService.sidebarEvent($event);
  }

  async menuItemAction(menuName: string) {
    switch (menuName) {
      case "All":
        
        break;
      case "Make a Story":
        
        break;
      case "Ask a doubt":
        
        break;
      case "Parents":
        
        break;
      case "Teachers":
        
        break;
      case "Divyang":
        
        break;
      case "Tribal":
        
        break;
      case "Lullabies":
        
        break;
      case "Games":
        
        break;
      default:
        break;
    }
  }

  private autoSyncTelemetry() {
    this.telemetryAutoSyncService.start(30 * 1000).subscribe();
  }
}
