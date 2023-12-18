import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Config } from './config/models/config';
import { apiConfig } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private apiService: ApiService) { }

  async getConfigMeta() : Promise<Config>{
    return await this.apiService.get(apiConfig.BASE_URL+apiConfig.CONFIG).then((res: any) =>{
      console.log("res in config file ", res?.result);
      if (res.result) {
        return res.result;
      }
    }).catch((err: any) => {
      console.log('err ', err);
    })
  }

  async getAllContent(req: any) : Promise<any>{
    console.log('req ', req);
    return await this.apiService.post(apiConfig.BASE_URL+apiConfig.PAGE_SEARCH_API, req).then((res: any) =>{
      console.log("res in config file ", res?.data.result);
      if (res.data.result) {
        return res.data.result;
      }
    }).catch((err: any) => {
      console.log('err ', err);
    })
  }
}
