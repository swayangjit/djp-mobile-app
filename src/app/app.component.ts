import { Component, OnInit, ViewChild } from '@angular/core';
import { AppHeaderService } from './services/app-header.service';
import { HeaderConfig } from './appConstants';
import { TranslateService } from '@ngx-translate/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { TelemetryAutoSyncService } from './services/telemetry/telemetry.auto.sync.service';
import { App } from '@capacitor/app';
import { ScannerService } from './services/scan/scanner.service';
import { ContentService } from './services/content/content.service';
import { LangaugeSelectComponent } from './components/langauge-select/langauge-select.component';
import { Router } from '@angular/router';
import {Location} from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  headerConfig!: HeaderConfig;
  langModalOpen: boolean = false;
  languages: Array<any> = [];
  @ViewChild('mainContent', { read: IonRouterOutlet, static: false }) routerOutlet!: IonRouterOutlet;
  constructor(private headerService: AppHeaderService,
    private translate: TranslateService,
    private telemetryAutoSyncService: TelemetryAutoSyncService,
    private scannerService: ScannerService,
    private contentService: ContentService,
    private modalCtrl: ModalController,
    private router: Router,
    private location: Location) {
  }

  async ngOnInit() {
    this.headerService.headerConfigEmitted$.subscribe((config: HeaderConfig) => {
      this.headerConfig = config;
    });
    this.headerService.filterConfigEmitted$.subscribe((val: any) => {
      this.languages = val.languages;
      console.log(val, this.languages);
    })
    this.autoSyncTelemetry()
    App.addListener('pause', () => this.telemetryAutoSyncService.pause());
    App.addListener('resume', () => this.telemetryAutoSyncService.continue());
  }

  async handleHeaderEvents($event: any) {
    console.log('events', $event);
    if (($event as any).name == 'scan') {
      this.scannerService.requestPermission(
        (scannedData) => {
          if (scannedData === 'cancel' ||
              scannedData === 'cancel_hw_back' ||
              scannedData === 'cancel_nav_back') {
                return;
              }
          console.log("Scan Result", scannedData);
          let scannenValue = ''
          const execArray = (new RegExp('(\/dial\/(?<djp>[a-zA-Z0-9]+))')).exec(scannedData);
          if (execArray && execArray.length > 1) {
            scannenValue = execArray[2]
          }
          console.log('Scanned Value', scannenValue);
          this.router.navigate(['/qr-scan-result'], {state: {scannedData: scannenValue}})
        },
        (error) => {
          console.warn(error);
        }
      );
    } else if($event.name == "profile") {
      if(!this.langModalOpen) {
        this.presentModal();
        this.langModalOpen = true
      }
    } else if($event.name == "search") {
      this.router.navigate(['/search']);
    }
    this.headerService.sidebarEvent($event);
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: LangaugeSelectComponent,
      componentProps: {
        languages: this.languages
      },
      cssClass: 'lang-modal',
      breakpoints: [0.3],
      initialBreakpoint: 0.3,
      handle: false,
      handleBehavior: "none"
    });
    await modal.present();
    modal.onDidDismiss().then((_ => {
      console.log('dismiss');
      this.langModalOpen = false
    }));
  }

  async menuItemAction(item: any) {
    this.headerService.sideMenuItemEvents(item);
  }

  private autoSyncTelemetry() {
    this.telemetryAutoSyncService.start(30 * 1000).subscribe();
  }
}
