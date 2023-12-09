import { Injectable } from '@angular/core';
import { capSQLiteSet } from '@capacitor-community/sqlite';
import { DbService } from '..';
import { Content } from './models/content';
import { ContentEntry } from './db/content.schema';
import { RecentlyViewedContentEntry } from './db/recently.viewed.content.schema';
import { ContentMapper } from './util/content.entry.mapper';
import { RecentlyViewedContentMapper } from './util/recently.viewed.content.mapper';
import { RecentlyViewedContent } from './models/recently.viewed.content';
import { ContentRVCEntry } from './db/content.rvc';
import { ContentRVCMixMapper } from './util/content.rvc.mix.entry.mapper';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(
    private readonly dbService: DbService
  ) { }

  saveContents(contentList: Array<Content>) {
    const capSQLiteSet: capSQLiteSet[] = [];
    contentList.map((content) => {
      capSQLiteSet.push({ statement: ContentEntry.insertQuery(), values: ContentMapper.mapContentToValues(content) })
    });
    this.dbService.executeSet(capSQLiteSet)
  }

  async getRecentlyViewedContent(uid: string): Promise<Array<RecentlyViewedContent>> {
    const query = `SELECT rvc.* ,c.*
    FROM ${RecentlyViewedContentEntry.TABLE_NAME} rvc
    LEFT JOIN ${ContentEntry.TABLE_NAME} c
    ON rvc.content_identifier=c.identifier where rvc.uid='${uid}'`;
    console.log('get RecentlyViewed', query);
    
    const result: ContentRVCEntry.ContentRVCMixedSchemaMap[] = await this.dbService.executeQuery(query);
    const recentlyViewedContent: Array<RecentlyViewedContent> = []
    result.map((contentRVC:ContentRVCEntry.ContentRVCMixedSchemaMap)=>{
      recentlyViewedContent.push(ContentRVCMixMapper.mapContentRVCtoRecentlyViedContent(contentRVC))
    })
    return Promise.resolve(recentlyViewedContent)
  }

  markContentAsViewed(content: Content): Promise<void> {
    return this.dbService.save(RecentlyViewedContentEntry.insertQuery(), RecentlyViewedContentMapper.mapContentToRecentlyViewedContentEntry(content, 'guest'))
  }

}

