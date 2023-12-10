import { CapacitorHttp } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  connected = true;
  public constructor(
    private toastController: ToastController
  ){
    Network.addListener('networkStatusChange', async status => {
      this.connected = status.connected;
    });

    this.toastController.create({ animated: false }).then(t => { t.present(); t.dismiss(); });
  }

  public async get(url: string){
    const options = {
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
    };
    return await CapacitorHttp.get(options).then((res: any) => {
      return res.data;
    }).catch(err => {
      return err
    })
  }

  public post(url: string, data: any){
    const options = {
      url,
      data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
    };
    return CapacitorHttp.post(options);
  }
}