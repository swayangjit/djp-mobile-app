import { Injectable } from '@angular/core';
import { ApiPreprocessor } from '../api-preprocessor';
import { APIConstants, Content, request, sourceConfig } from '../../appConstants';
import { ApiService } from '../api.service';
import { PreprocessorService } from './preprocessor.service';
import { Mapping, MappingElement, Source } from '../config/models/config';
import { ContentMetaData } from '../content/models/content';

@Injectable({
  providedIn: 'root'
})
export class SunbirdPreprocessorService implements ApiPreprocessor {
  sunbirdConfig!: Content;
  processorContentList!: Array<any>;
  constructor(private apiService: ApiService,
    private preprocessService: PreprocessorService) { }

  async process(source: Source, mappingElement: MappingElement | undefined) {
    this.sunbirdConfig = { source: '', sourceType: '', metaData: { name: '', identifier: '', thumbnail: '', description: '', mimeType: '', url: '', focus: '', keyword: '' } };
    this.processorContentList = [];
    // APi call base url
    let searchData: any = await this.apiService.post(source.baseURL + '/' + APIConstants.SEARCH_API, { 'request': source['searchCriteria'] });
    console.log('data ', searchData);
    if (searchData.status == 200) {
      let contentList = searchData.data.result.content;

      contentList.forEach((content: any) => {
        if (mappingElement) {
          const processedContent: Content = { source: source.sourceName, sourceType: source.sourceType, metaData: { name: '', identifier: '', thumbnail: '', description: '', mimeType: '', url: '', focus: '', keyword: '' } };
          Object.keys(mappingElement.mapping).forEach((key: string) => {
            const value = mappingElement.mapping[key as keyof Mapping]
            processedContent.metaData[key as keyof ContentMetaData] = content[value] ?? undefined
          })
          this.processorContentList.push(processedContent);
        }

      });
      this.preprocessService.sunbirdSrcProcess(this.processorContentList)
    }

  }
}
