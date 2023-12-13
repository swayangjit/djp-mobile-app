import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppHeaderService, StorageService, UtilService } from '../../../app/services';
import { TelemetryService } from '../../../app/services/telemetry/telemetry.service';
import { telemetryConfig } from '../../../app/services/telemetry/telemetryConstants';
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
  isMenuOpen: boolean = false;
  filters: Array<any> = []
  constructor(private utilService: UtilService,
    private storageService: StorageService,
    private telemetryService: TelemetryService,
    public menuCtrl: MenuController,
    public headerService: AppHeaderService
    ) {}

  async ngOnInit() {
    this.appInfo = await this.utilService.getAppInfo();
    this.filters = [];
    this.headerService.filterConfigEmitted$.subscribe((val: any) => {
      this.filters = val;
    })
  }

  async scan() {
    console.log('scan ');
    let interactConfig = telemetryConfig;
    interactConfig.edata = { type: "select-scan", subtype: "", pageid: "app-header", uri: "app-header"};
    interactConfig.options.context.did = await this.utilService.getDeviceId();
    interactConfig.options.context.sid = await this.storageService.getData('sid');
    interactConfig.options.context.env = 'app-header';
    interactConfig.options.context.pdata = {"id": this.appInfo.id, "pid": this.appInfo.name, "ver": this.appInfo.version};
    interactConfig.actor = {type: 'User', id: ''}
    this.telemetryService.raiseInteractTelemetry(interactConfig)
  }

  async handleSearch(event: Event) {
    this.emitEvent(event, 'search');
  }

  emitEvent(event: Event, name: string) {
    if (name == 'scan') {
      this.scan();
    }
    this.headerEvents.emit({event, name});
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
