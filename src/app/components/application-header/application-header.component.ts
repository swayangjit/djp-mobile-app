import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService, UtilService } from '../../../app/services';
import { TelemetryService } from '../../../app/services/telemetry/telemetry.service';
import { telemetryConfig } from '../../../app/services/telemetry/telemetryConstants';
import { sidebarMenuItems } from 'src/app/appConstants';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-application-header',
  templateUrl: './application-header.component.html',
  styleUrls: ['./application-header.component.scss'],
})
export class ApplicationHeaderComponent  implements OnInit {
  appInfo: any;
  @Input() headerConfig: any = false;
  @Output() headerEvents = new EventEmitter();
  @Output() sideMenuItemEvent = new EventEmitter();
  sidebarMenuItems: any;
  isMenuOpen: boolean = false;

  constructor(private utilService: UtilService,
    private storageService: StorageService,
    private telemetryService: TelemetryService,
    public menuCtrl: MenuController,
    ) { 
      this.sidebarMenuItems = sidebarMenuItems
    }

  async ngOnInit() {
    this.appInfo = await this.utilService.getAppInfo();
  }

  async scan(event: Event) {
    console.log('scan ');
    let interactConfig = telemetryConfig;
    interactConfig.edata = { type: "select-scan", subtype: "", pageid: "app-header", uri: "app-header"};
    interactConfig.options.context.did = await this.utilService.getDeviceId();
    interactConfig.options.context.sid = await this.storageService.getData('sid');
    interactConfig.options.context.env = 'app-header';
    interactConfig.options.context.pdata = {"id": this.appInfo.id, "pid": this.appInfo.name, "ver": this.appInfo.version};
    interactConfig.actor = {type: 'User', id: ''}
    this.telemetryService.raiseInteractTelemetry(interactConfig)
    this.emitEvent(event, 'scan');
  }

  emitEvent(event: Event, name: string) {
    if (name === 'scan') {
        this.headerEvents.emit({ name, event });
    } else {
      this.headerEvents.emit({ name, event });
    }
  }

  async editProfile(event: Event) {
    let interactConfig = telemetryConfig;
    interactConfig.edata = { type: "select-language", subtype: "", pageid: "app-header", uri: "app-header"};
    interactConfig.options.context.did = await this.utilService.getDeviceId();
    interactConfig.options.context.sid = await this.storageService.getData('sid');
    interactConfig.options.context.env = 'app-header';
    interactConfig.options.context.pdata = {"id": this.appInfo.id, "pid": this.appInfo.name, "ver": this.appInfo.version};
    interactConfig.actor = {type: 'User', id: ''}
    this.telemetryService.raiseInteractTelemetry(interactConfig)
    this.emitEvent(event, 'profile');
  }

  async toggleMenu() {
    await this.menuCtrl.toggle();
    this.isMenuOpen = await this.menuCtrl.isEnabled();
    if (this.isMenuOpen) {
    }
  }

  emitSideMenuItemEvent(event: any, item: string) {
    this.menuCtrl.close().then(() => {
      this.sideMenuItemEvent.emit({ item });
    }).catch((e) => {
      this.sideMenuItemEvent.emit({ item });
    })
  }
}
