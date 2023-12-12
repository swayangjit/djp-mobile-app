import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  connected: boolean = false;

  private networkInfo = new Subject<any>();
  networkConnection$ = this.networkInfo.asObservable();

  constructor() {
    Network.addListener('networkStatusChange', async (status: any) => {
      this.connected = status.connected;
      this.networkInfo.next(this.connected);
    });
  }

  
  async getNetworkStatus(): Promise<boolean> {
    this.connected = await (await Network.getStatus()).connected
    return this.connected;
  }


}
