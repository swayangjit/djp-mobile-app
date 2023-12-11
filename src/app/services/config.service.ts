import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { APIConstants } from '../appConstants';
import { Config } from './config/models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private apiService: ApiService) { }

  async getConfigMeta() : Promise<Config>{
    return await this.apiService.get(APIConstants.BASE_URL+APIConstants.CONFIG).then((res: any) =>{
      console.log("res in config file ", res?.result);
      if (res.result) {
        return res.result;
      }
    }).catch((err: any) => {
      console.log('err ', err);
    })
  }
}
