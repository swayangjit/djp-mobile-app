import { Injectable } from '@angular/core';
import { APIConstants } from '../appConstants';
import { ApiService } from '.';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private apiService: ApiService
  ) { }

  async postSearchContext(data: any, audio: boolean): Promise<any> {
    let request = {};
    if(audio) {
      request = {
        "audio": data.text,
        "language": data.currentLang
      }
    } else {
      request = {
        "text": data.text,
        "language": data.currentLang
      }
    }
    let body = JSON.stringify(request)
    console.log("body ", body);
    return await this.apiService.post(APIConstants.SEARCH_BASE_URL+APIConstants.CONTEXT_SEARCH, body).then(res => {
      console.log('result ', res);
      return res?.data;
    }).catch(e => {
      return e;
    })
  }

  async postContentSearch(data: any) {
    let request = {
      request: {
        query: data.query,
        filters: data.filter ?? ""
      }
    }
    return await this.apiService.post(APIConstants.BASE_URL+APIConstants.CONTENT_SEARCH_API, request).then(res => {
      console.log('result ', res);
      return res.data;
    }).catch(e => {
      return e;
    });
  }
}
