import { Injectable } from '@angular/core';
import { capSQLiteSet } from '@capacitor-community/sqlite';
import { ApiService, DbService } from '..';
import { Content } from './models/content';
import { ContentEntry } from './db/content.schema';
import { RecentlyViewedContentEntry } from './db/recently.viewed.content.schema';
import { ContentMapper } from './util/content.entry.mapper';
import { RecentlyViewedContentMapper } from './util/recently.viewed.content.mapper';
import { RecentlyViewedContent } from './models/recently.viewed.content';
import { ContentRVCEntry } from './db/content.rvc';
import { ContentRVCMixMapper } from './util/content.rvc.mix.entry.mapper';
import { v4 as uuidv4 } from "uuid";
import { MimeType } from 'src/app/appConstants';
import { HttpResponse } from '@capacitor/core';
import { ContentUtil } from './util/content.util';
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  public results: Array<any> = [];

  constructor(
    private readonly dbService: DbService,
    private readonly apiService: ApiService
  ) { }

  deleteAllContents(): Promise<any> {
    return this.dbService.remove(ContentEntry.deleteQuery(), {'source': 'djp'});
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
    ON rvc.content_identifier=c.identifier where rvc.uid='${uid}' ORDER BY rvc.ts DESC`;
    console.log('get RecentlyViewed', query);

    const result: ContentRVCEntry.ContentRVCMixedSchemaMap[] = await this.dbService.executeQuery(query);
    const recentlyViewedContent: Array<RecentlyViewedContent> = []
    result?.map((contentRVC: ContentRVCEntry.ContentRVCMixedSchemaMap) => {
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
    return this.dbService.readDbData(RecentlyViewedContentEntry.readQuery(), { 'identifier': content.metaData.identifier }).then((result) => {
      const query = (result) ? RecentlyViewedContentEntry.updateQuery() : RecentlyViewedContentEntry.insertQuery();
      const whereCondition = (result) ? { 'identifier': content.metaData.identifier } : undefined
      return this.dbService.save(query, RecentlyViewedContentMapper.mapContentToRecentlyViewedContentEntry(content, 'guest', uuidv4()), whereCondition)
    })

  }

  public searchContentInDiksha(query: string) {
    let url = "https://diksha.gov.in/api/content/v1/search"
    let body = {
      "request": {
        "filters": {
          "channel": "01246375399411712074",
          "primaryCategory": [
            "Collection",
            "Resource",
            "Content Playlist",
            "Course",
            "Course Assessment",
            "Digital Textbook",
            "eTextbook",
            "Explanation Content",
            "Learning Resource",
            "Practice Question Set",
            "Teacher Resource",
            "Textbook Unit",
            "LessonPlan",
            "FocusSpot",
            "Learning Outcome Definition",
            "Curiosity Questions",
            "MarkingSchemeRubric",
            "ExplanationResource",
            "ExperientialResource",
            "Practice Resource",
            "TVLesson",
            "Question paper"
          ],
          "visibility": [
            "Default",
            "Parent"
          ]
        },
        "limit": 100,
        "query": query ? query : "H2H2D7",
        "sort_by": {
          "lastPublishedOn": "desc"
        },
        "fields": [
          "name",
          "appIcon",
          "mimeType",
          "gradeLevel",
          "identifier",
          "medium",
          "pkgVersion",
          "board",
          "subject",
          "resourceType",
          "primaryCategory",
          "contentType",
          "channel",
          "organisation",
          "trackable"
        ],
        "softConstraints": {
          "badgeAssertions": 98,
          "channel": 100
        },
        "mode": "soft",
        "facets": [
          "se_boards",
          "se_gradeLevels",
          "se_subjects",
          "se_mediums",
          "primaryCategory"
        ],
        "offset": 0
      }
    }
    return this.apiService.post(url, body);
  }

  public getCollectionHierarchy(identifier: string) {
    let url = `https://diksha.gov.in/action/content/v3/hierarchy/${identifier}`
    return this.apiService.get(url);
  }

  public getContents(query: string): Promise<Array<Content>> {
    return this.searchContentInDiksha(query)
      .then((response: HttpResponse) => {
        return this.getCollectionHierarchy(
          response.data.result.content[0].identifier
        );
      })
      .then((hierarchyResponse) => {
        this.showAllChild(hierarchyResponse.result.content)
        const contentList: Array<Content> = []
        this.results.map((content: any) => {
          contentList.push({
            source: 'sunbird',
            sourceType: 'Diksha',
            metaData: {
              identifier: content?.identifier,
              name: content?.name,
              thumbnail: content?.posterImage,
              description: content?.name,
              mimetype: content?.mimetype,
              url: content?.streamingUrl,
              focus: content?.focus,
              keyword: content?.keyword,
              domain: content?.domain,
              curriculargoal: content?.curriculargoal,
              competencies: content?.competencies,
              language: content?.language,
              category: content?.category,
              audience: content?.audience,
              status: content?.status,
              createdon: content?.createdon,
              lastupdatedon: content?.lastupdatedon
            }
          })
        })
        return contentList;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  private showAllChild(content: any) {
    if (
      content.children === undefined ||
      !content.children.length ||
      ContentUtil.isTrackable(content) === 1) {
      if (
        (content.mimeType !== MimeType.COLLECTION ||
          ContentUtil.isTrackable(content) === 1) && [MimeType.VIDEO, MimeType.PDF].indexOf(content.mimeType) > -1
      ) {
        this.results.push(content);
      }
      return;
    }
    content.children.forEach((child: any) => {
      this.showAllChild(child);
    });
    console.log('Results', this.results);

  }

}

