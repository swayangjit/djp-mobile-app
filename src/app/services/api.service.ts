import { CapacitorHttp } from '@capacitor/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public constructor(){}

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