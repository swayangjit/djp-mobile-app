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
import { v4 as uuidv4 } from "uuid";
@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(
    private readonly dbService: DbService
  ) { }

  deleteAllContents(): Promise<any>{
    return this.dbService.executeQuery(ContentEntry.deleteQuery())
  }
  saveContents(contentList: Array<Content>): Promise<any> {
    const capSQLiteSet: capSQLiteSet[] = [];
    contentList.map((content) => {
      capSQLiteSet.push({ statement: ContentEntry.insertQuery(), values: ContentMapper.mapContentToValues(content) })
    });
    return this.dbService.executeSet(capSQLiteSet)
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
      recentlyViewedContent.push(ContentRVCMixMapper.mapContentRVCtoRecentlyViedContent(contentRVC, uuidv4()))
    })
    return Promise.resolve(recentlyViewedContent)
  }

  async getAllContent(): Promise<Array<Content>> {
    const query = `SELECT * FROM ${ContentEntry.TABLE_NAME}`;
    let res = await this.dbService.readDbData(query);
    return Promise.resolve(res);
  }

  markContentAsViewed(content: Content): Promise<void> {
    return this.dbService.save(RecentlyViewedContentEntry.insertQuery(), RecentlyViewedContentMapper.mapContentToRecentlyViewedContentEntry(content, 'guest', uuidv4()))
  }

}

