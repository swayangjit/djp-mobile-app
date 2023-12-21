import { Injectable } from '@angular/core';
import { ApiPreprocessor } from '../api-preprocessor';
import { request, sourceConfig } from '../../appConstants';
import { PreprocessorService } from './preprocessor.service';
import { Content } from '../content/models/content';
import { apiConfig } from 'src/environments/environment.prod';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DikshaPreprocessorService implements ApiPreprocessor {
  sunbirdConfig!: Content;
  processorArray!: Array<any>;
  constructor(private apiService: ApiService,
    private preprocessService: PreprocessorService) {}

  async process(input: sourceConfig) {
    // console.log('sunbird input ', input);
    // this.sunbirdConfig = {source: '', sourceType: '', metaData: {
    //   name: '', identifier: '', thumbnail: '', description: '', mimetype: '', url: '', focus: '', keyword: '',
    //   domain: '',
    //   curriculargoal: null,
    //   competencies: null,
    //   language: '',
    //   category: '',
    //   audience: [],
    //   status: '',
    //   createdon: '',
    //   lastupdatedon: ''
    // }};
    // this.processorArray = [];
    // let requestBody = request
    // this.sunbirdConfig.sourceType = input.sourceType;
    // this.sunbirdConfig.metaData.name = input.sourceName;
    // this.sunbirdConfig.source = input.sourceName;
    // // APi call base url
    // let searchData: any = await this.apiService.post(input.baseURL+'/'+apiConfig.SEARCH_API, requestBody);
    // console.log('data ', searchData);
    // if (searchData.status == 200) {
    //   let conData = searchData.data.result.content;
    //   conData.forEach((data: any) => {
    //     this.sunbirdConfig.metaData.identifier = data.identifier;
    //     this.sunbirdConfig.metaData.thumbnail = data.appIcon;
    //     this.sunbirdConfig.metaData.description = "";
    //     this.sunbirdConfig.metaData.mimetype = data.mimetype;
    //     this.sunbirdConfig.metaData.url = "";
    //     this.sunbirdConfig.metaData.focus = "";
    //     this.sunbirdConfig.metaData.keyword = '';
    //   });
    //   this.processorArray.push(this.sunbirdConfig);
    //   this.preprocessService.sunbirdSrcProcess(this.processorArray)
    // }
    
  }
}
