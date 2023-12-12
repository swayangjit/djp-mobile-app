import { Injectable } from '@angular/core';
import { App, AppInfo } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import { DeviceSpecification } from './telemetry/models/telemetry';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private translate: TranslateService) { }

  async getDeviceSpec(): Promise<DeviceSpecification> {
    const spec = await Device.getInfo();
    const did = await this.getDeviceId();
    return {
      os: `${spec.operatingSystem} ${spec.osVersion}`,
      make: spec.manufacturer,
      id: did
    } as DeviceSpecification
  }
  async getDeviceId(): Promise<string> {
    return (await Device.getId()).identifier;
  }
  async getAppInfo(): Promise<AppInfo> {
    return await App.getInfo();
  }

  translateMessage(messageConst: string, fields?: string | any): string {
    let translatedMsg = '';
    let replaceObject: any = '';

    if (typeof (fields) === 'object') {
      replaceObject = fields;
    } else {
      replaceObject = { '%s': fields };
    }

    this.translate.get(messageConst, replaceObject).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
}
