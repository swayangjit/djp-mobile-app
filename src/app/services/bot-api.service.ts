import { Injectable } from '@angular/core';
import { config } from 'src/environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '.';
import { ApiHttpRequestType, ApiRequest } from './api/model/api.request';
import { catchError, lastValueFrom, map, tap } from 'rxjs';
import { ApiResponse } from './api/model/api.response';
import { Sakhi } from '../appConstants';

@Injectable({
  providedIn: 'root'
})
export class BotApiService {

  constructor(
    private apiService: ApiService,
    private translate: TranslateService
  ) { }

  async getBotMessage(text: string, audio: string, botType: string): Promise<any> {
    console.log('text ', text, text !== "");
    console.log('audio ', audio, audio !== "");
    let botApiPath = this.getBotApiPath(botType);
    let baseUrl = this.getBotBaseUrl(botType)
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
      .withHost(baseUrl)
      .withPath(botApiPath)
      .withType(ApiHttpRequestType.POST)
      .withBearerToken(true)
      .withBody(req)
      .build()
    return lastValueFrom(this.apiService.fetch(apiRequest).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((err) => {
        throw err;
      })
    ));
  }

  getBotApiPath(type: string): string {
    switch (type) {
      case Sakhi.STORY:
        return config.api.BOT_SAKHI_API_PATH;
      case Sakhi.PARENT:
        return config.api.BOT_ACTIVITY_API_PATH;
      case Sakhi.TEACHER:
        return config.api.BOT_ACTIVITY_API_PATH;
      default:
        return '';
    }
  }

  getBotBaseUrl(type: string): string {
    switch (type) {
      case Sakhi.STORY:
        return config.api.STORY_BOT_BASE_URL;
      case Sakhi.PARENT:
        return config.api.BOT_BASE_URL;
      case Sakhi.TEACHER:
        return config.api.BOT_BASE_URL;
      default:
        return '';
    }
  }
}
