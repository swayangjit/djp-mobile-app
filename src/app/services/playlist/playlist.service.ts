import { Injectable } from '@angular/core';
import { capSQLiteSet } from '@capacitor-community/sqlite';
import { DbService } from '..';
import { PlayListEntryMapper } from './utils/playlist.entry.mapper';
import { v4 as uuidv4 } from "uuid";
import { PlayList, PlayListContent, PlayListContentMix } from './models/playlist.content';
import { PlaylistEntry } from './db/playlist.schema';
import { PlaylistContentEntry } from './db/playlist.content.schema';
import { ContentEntry } from '../content/db/content.schema';
import { ContentMapper } from '../content/util/content.entry.mapper';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(
    private readonly dbService: DbService
  ) { }

  public createPlayList(name: string, uid: string, playListContentList: Array<PlayListContent>, playListId?: string): Promise<any> {
    const query: string = !!playListId ? PlaylistEntry.updateQuery() : PlaylistEntry.insertQuery();
    const whereCondition = !!playListId ? { 'identifier': playListId } : undefined;
    const isEditMode: boolean = !!playListId;
    if (!playListId) {
      playListId = uuidv4()
    }
    return this.dbService.save(query, PlayListEntryMapper.mapContentToPlayListEntry(name, uid, playListId, playListContentList.length), whereCondition).then(() => {
      return this.addContentToPlayList(playListId!, playListContentList, isEditMode)
    })
  }

  public async addContentToPlayList(playListId: string, playListContentList: Array<PlayListContent>, isEditMode?: boolean): Promise<any> {
    const capSQLiteSet: capSQLiteSet[] = [];
    for (let i = 0; i < playListContentList.length; i++) {
      const playListContent = playListContentList[i];
      if (playListContent.isDeleted) {
        capSQLiteSet.push({ statement: PlaylistContentEntry.deleteQuery(), values: [playListContentList[i].identifier, playListId] });
      } else {
        if (!isEditMode) {
          if (playListContent.type == 'local') {
            const localData = await this.dbService.readDbData(ContentEntry.readQuery(), { 'identifier': playListContent.identifier })
            if (!localData) {
              capSQLiteSet.push({ statement: ContentEntry.insertQuery(), values: ContentMapper.mapContentToValues(playListContent.localContent!) })
            }

          }
          capSQLiteSet.push({ statement: PlaylistContentEntry.insertQueryWithColumns(), values: PlayListEntryMapper.mapContentToValues(uuidv4(), playListId, playListContentList[i].identifier, playListContentList[i].type) })
        } else {
          capSQLiteSet.push({ statement: PlaylistContentEntry.insertQueryWithColumns(), values: PlayListEntryMapper.mapContentToValues(uuidv4(), playListId, playListContentList[i].identifier, playListContentList[i].type) })
        }
      }
    }
    if (capSQLiteSet.length) {
      return this.dbService.executeSet(capSQLiteSet);
    } else {
      return Promise.resolve({});
    }
  }

  public async getAllPlayLists(uid: string): Promise<Array<PlayList>> {
    return this.dbService.readDbData(PlaylistEntry.readQuery(), { 'uid': uid }, `ORDER BY ${PlaylistEntry.COLUMN_NAME_TIME_STAMP} DESC`).then(async (playListDbLists: any[]) => {
      const playLists: Array<PlayList> = []
      if (playLists && playListDbLists?.length) {
        for (let i = 0; i < playListDbLists.length; i++) {
          const playlistDetails = await this.getPlayListDetails(playListDbLists[i].identifier)
          playLists.push(playlistDetails);
        }
      }
      return playLists;
    })
  }


  public getPlayListDetails(playListId: string): Promise<PlayList> {
    return this.dbService.readDbData(PlaylistEntry.readQuery(), { 'identifier': playListId }, `ORDER BY ${PlaylistEntry.COLUMN_NAME_TIME_STAMP} DESC`).then((playListDetails) => {
      return this.getPlayListContents(playListId).then((plContentList: Array<PlayListContentMix>) => {
        return Promise.resolve({
          identifier: playListDetails[0]['identifier'],
          name: playListDetails[0]['name'],
          uid: playListDetails[0]['uid'],
          playListcontentList: plContentList
        })
      })
    })
  }

  public getPlayListContents(playListId: string): Promise<Array<PlayListContentMix>> {
    const query = `SELECT
    pc.identifier  as plc_identifier, pc.type, c.*
    FROM ${PlaylistContentEntry.TABLE_NAME}  pc
    LEFT JOIN ${ContentEntry.TABLE_NAME} c
    ON pc.content_id = c.identifier 
    WHERE ${PlaylistContentEntry.COLUMN_NAME_PLAYLIST_IDENTIFIER} = '${playListId}'
    ORDER BY pc.ts DESC`;

    return this.dbService.executeQuery(query).then((playlistContentList: any[]) => {
      const plContentList: Array<PlayListContentMix> = []
      if (playlistContentList && playlistContentList.length) {
        playlistContentList.map((playListContent) => {
          plContentList.push({
            identifier: playListContent['plc_identifier'],
            type: playListContent['type'],
            source: playListContent['source'],
            sourceType: playListContent['source_type'],
            metaData: JSON.parse(playListContent['metadata'])
          })
        })
      }
      return plContentList
    })
  }

  public deletePlayList(playListId: string): Promise<any> {
    return this.dbService.remove(PlaylistEntry.deleteQuery(), { 'identifier': playListId }).then(() => {
      return this.dbService.remove(PlaylistContentEntry.deleteQueryOne(), { 'playlist_identifier': playListId })
    })
  }

  public deleteContentFromPlayList(playListId: string, contentIdentifierList: string[]): Promise<any> {
    const capSqlSet: capSQLiteSet[] = [];
    contentIdentifierList.map((identifier) => {
      capSqlSet.push({ statement: PlaylistContentEntry.deleteQuery(), values: [identifier, playListId] });
    })
    return this.dbService.executeSet(capSqlSet)
  }

}

