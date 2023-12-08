import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderConfig } from 'src/app/appConstants';
import { StorageService, UtilService } from 'src/app/services';
import { TelemetryService } from 'src/app/services/telemetry/telemetry.service';
import { telemetryConfig } from 'src/app/services/telemetry/telemetryConstants';
@Component({
  selector: 'app-application-header',
  templateUrl: './application-header.component.html',
  styleUrls: ['./application-header.component.scss'],
})
export class ApplicationHeaderComponent  implements OnInit {

  @Input() headerConfig: HeaderConfig = {showHeader: false, pageTitle: '', showbackButton: false};
  @Output() headerEvents = new EventEmitter();
  constructor(private utilService: UtilService,
    private storageService: StorageService,
    private telemetryService: TelemetryService) { }

  ngOnInit() {}

  async scan(event: Event) {
    console.log('scan ');
    let info = await this.utilService.getAppInfo();
    let interactConfig = telemetryConfig;
    interactConfig.edata = { type: "select-scan", subtype: "", pageid: "app-header", uri: "app-header"};
    interactConfig.options.context.did = await this.utilService.getDeviceId();
    interactConfig.options.context.sid = await this.storageService.getData('sid');
    interactConfig.options.context.env = 'app-header';
    interactConfig.options.context.pdata = {"id": info.id, "pid": info.name, "ver": info.version};
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

  editProfile(event: Event) {
    this.emitEvent(event, 'profile');
  }
}
