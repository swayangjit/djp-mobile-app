import { Injectable } from '@angular/core';
import { ApiPreprocessor } from '../api-preprocessor';
import { PreprocessorService } from './preprocessor.service';
import { Mapping, MappingElement, Source } from '../config/models/config';
import { Content, ContentMetaData } from '../content/models/content';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SunbirdPreprocessorService implements ApiPreprocessor {
  botConfig!: Content;
  processorContentList!: Array<any>;
  constructor(private apiService: ApiService,
    private preprocessService: PreprocessorService) { }

  async process(source: Source, mappingElement: MappingElement | undefined) {
    // this.botConfig = { source: '', sourceType: '', metaData: {
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
    // } };
    // this.processorContentList = [];
    // // APi call base url
    // let searchData: any = await this.apiService.post(source.baseURL + '/' + apiConfig.SEARCH_API, { 'request': source['searchCriteria'] });
    // console.log('data ', searchData);
    // if (searchData.status == 200) {
    //   let contentList = searchData.data.result.content;

    //   contentList.forEach((content: any, i: number) => {
    //     if (mappingElement) {
    //       const processedContent: Content = { source: source.sourceName, sourceType: source.sourceType, metaData: {
    //         name: '', identifier: '', thumbnail: '', description: '', mimetype: '', url: '', focus: '', keyword: '',
    //         domain: '',
    //         curriculargoal: null,
    //         competencies: null,
    //         language: '',
    //         category: '',
    //         audience: [],
    //         status: '',
    //         createdon: '',
    //         lastupdatedon: ''
    //       } };
    //       Object.keys(mappingElement.mapping).forEach((key: string) => {
    //         const value = mappingElement.mapping[key as keyof Mapping]
    //         // processedContent.metaData[key as keyof ContentMetaData] = content[value] ?? undefined
    //       })
    //       // Required ***
    //       // if(i%5 == 0) {
    //       //   this.processorContentList.push(this.botConfig)
    //       // }
    //       // this.processorContentList.push(processedContent);
    //     }
        
    //   });
    //   youtubeContentArr.forEach((arr, i) => {
    //     if(i==5 && i%5 == 0) {
    //       this.processorContentList.push(this.botConfig)
    //     }
    //     this.processorContentList.push(arr);
    //   })
    //   this.preprocessService.sunbirdSrcProcess(this.processorContentList)
    // }

  }
}
