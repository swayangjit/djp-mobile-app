import { Injectable } from '@angular/core';
import { config } from 'src/environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '.';
import { ApiHttpRequestType, ApiRequest } from './api/model/api.request';
import { catchError, lastValueFrom, map, tap } from 'rxjs';
import { ApiResponse } from './api/model/api.response';

@Injectable({
  providedIn: 'root'
})
export class BotApiService {

  constructor(
    private apiService: ApiService,
    private translate: TranslateService
  ) { }

  async getBotMessage(text: string, audio: string): Promise<any> {
    console.log('text ', text, text !== "");
    console.log('audio ', audio, audio !== "");
    let req = {
      input: {},
      output: {
        format: text ? "text" : "audio"
      }
    }
    if (text !== "") {
      req.input = {
        language: this.translate.currentLang,
        text: text
      }
    } else if (audio !== "") {
      req.input = {
        language: this.translate.currentLang,
        audio: audio
      }
    }
    const apiRequest = new ApiRequest.Builder()
      .withHost(config.api.BOT_BASE_URL)
      .withPath(config.api.BOT_QUERY_API)
      .withType(ApiHttpRequestType.POST)
      .withBearerToken(true)
      .withBody(req)
      .build()
    return lastValueFrom(this.apiService.fetch(apiRequest).pipe(
      map((response: ApiResponse) => {
        if(response.responseCode === 200) {
          return response.body;
        }
      }),
      catchError((err) => {
        throw err;
      })
    ));
  }
}
