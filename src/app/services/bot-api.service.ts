import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiConfig } from 'src/environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class BotApiService {

  constructor(
    private apiService: ApiService,
    private translate: TranslateService
  ) { }

  async getBotMessage(text:string, audio: string): Promise<any> {
    console.log('text ',text, text!=="");
    console.log('audio ',audio, audio!=="");
    let req = {
      input: {},
      output: {
        format: text ? "text" : "audio"
      }
    }    
    if(text !== "") {
      req.input = {
        language: this.translate.currentLang,
        text: text
      }
    } else if(audio !== "") {
      req.input = {
        language: this.translate.currentLang,
        audio: audio
      }
    }
    return await this.apiService.post(apiConfig.BOT_BASE_URL+apiConfig.BOT_QUERY_API, req).then((res: any) => {
      console.log('res ', res);
      if(res.status == 200 && res.data) {
        console.log('res data', res.data);
        return res.data;
      } else {
        return res.data;
      }
    }).catch(err => 
      {return err});
  }
}
