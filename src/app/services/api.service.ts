import { CapacitorHttp } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  connected = true;
  deviceId: string = '';
  public constructor(
    private toastController: ToastController
  ) {
    Network.addListener('networkStatusChange', async (status: any) => {
      this.connected = status.connected;
    });

    this.toastController.create({ animated: false }).then(t => { t.present(); t.dismiss(); });
    Device.getId().then(response => {
      this.deviceId = response.identifier
      return this.deviceId
  })
  }

  public async get(url: string) {
    const options = {
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-device-id': this.deviceId
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
        'x-device-id': this.deviceId
      }
    };
    console.log('Post Options', options);

    return CapacitorHttp.post(options);
  }
}