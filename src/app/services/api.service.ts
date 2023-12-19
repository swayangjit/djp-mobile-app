import { CapacitorHttp } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { v4 as uuidv4 } from "uuid";
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  connected = true;
  deviceId: string = '';
  language: string = ''
  public constructor(
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    Network.addListener('networkStatusChange', async (status: any) => {
      this.connected = status.connected;
    });

    this.toastController.create({ animated: false }).then(t => { t.present(); t.dismiss(); });
    Device.getId().then(response => {
      this.deviceId = response.identifier
      return this.deviceId
    })
    this.language = translate.currentLang;
  }

  public async get(url: string) {
    const options = {
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-device-id': this.deviceId,
        'X-Source': 'mobileapp',
        'X-Request-ID': uuidv4(),
        'x-preferred-language': this.language
      }
    };
    return await CapacitorHttp.get(options).then((res: any) => {
      return res.data;
    }).catch(err => {
      return err
    })
  }

  public post(url: string, data: any) {
    const options = {
      url,
      data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-device-id': this.deviceId,
        'X-Source': 'mobileapp',
        'X-Request-ID': uuidv4(),
        'x-preferred-language': this.language
      }
    };
    console.log('Post Options', options);

    return CapacitorHttp.post(options);
  }
}