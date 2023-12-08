import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private translate: TranslateService) { }

  async getDeviceId(): Promise<string> {
    return await (await Device.getId()).identifier;
  }
  async getAppInfo(): Promise<any> {
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
