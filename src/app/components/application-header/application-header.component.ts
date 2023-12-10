import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService, UtilService } from '../../../app/services';
import { TelemetryService } from '../../../app/services/telemetry/telemetry.service';
import { telemetryConfig } from '../../../app/services/telemetry/telemetryConstants';
@Component({
  selector: 'app-application-header',
  templateUrl: './application-header.component.html',
  styleUrls: ['./application-header.component.scss'],
})
export class ApplicationHeaderComponent  implements OnInit {
  appInfo: any;
  @Input() headerConfig: any = false;
  @Output() headerEvents = new EventEmitter();
  constructor(private utilService: UtilService,
    private storageService: StorageService,
    private telemetryService: TelemetryService) { }

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
}
