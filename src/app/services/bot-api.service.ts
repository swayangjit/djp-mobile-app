import { Injectable } from '@angular/core';
import { config } from 'src/environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, DbService } from '.';
import { ApiHttpRequestType, ApiRequest } from './api/model/api.request';
import { catchError, lastValueFrom, map, tap } from 'rxjs';
import { ApiResponse } from './api/model/api.response';
import { Sakhi } from '../appConstants';
import { ChatMessage } from './bot/db/models/chat.message';
import { capSQLiteSet } from '@capacitor-community/sqlite';
import { BotChatEntry } from './bot/db/chat.schema';
import { BotChatEntryMapper } from './bot/db/utils/bot.chat.entry.mapper';

@Injectable({
  providedIn: 'root'
})
export class BotApiService {

  constructor(
    private apiService: ApiService,
    private translate: TranslateService,
    private dbService: DbService
  ) { }

  async getBotMessage(text: string, audio: string, botType: string): Promise<any> {
    console.log('text ', text, text !== "");
    console.log('audio ', audio, audio !== "");
    let botApiPath = this.getBotApiPath(botType);
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
      .withHost(config.api.BASE_URL)
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

  saveChatMessage(message: ChatMessage): Promise<any> {
    const capSQLiteSet: capSQLiteSet[] = [];
    capSQLiteSet.push({ statement: BotChatEntry.insertQueryWithColumns(), values: BotChatEntryMapper.mapChatToChatValues(message) })
    return this.dbService.executeSet(capSQLiteSet);
  }

  getAllChatMessages(botType: string): Promise<Array<ChatMessage>> {
    return this.dbService.readDbData(BotChatEntry.readQuery(), { 'bot_type': botType }).then((chatMessages: any[]) => {
      const chatMessageList: Array<ChatMessage> = []
      chatMessages.map((chatMessage: any) => {
        chatMessageList.push(BotChatEntryMapper.mapChatToChatEntryToModel(chatMessage))
      });
      return chatMessageList
    });
  }
}
