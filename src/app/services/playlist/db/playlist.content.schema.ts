import { DbConstants } from "src/app/appConstants";

export namespace PlaylistContentEntry {
   
    export const TABLE_NAME = 'playlist_content';
    export const _ID = '_id';
    export const COLUMN_NAME_IDENTIFIER = 'identifier';
    export const COLUMN_NAME_PLAYLIST_IDENTIFIER = 'playlist_identifier';
    export const COLUMN_NAME_CONTENT_ID = 'content_id';
    export const COLUMN_NAME_SOURCE_TYPE = 'type';
    export const COLUMN_NAME_TIME_STAMP = 'ts';

    export interface SchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_IDENTIFIER]: string;
        [COLUMN_NAME_CONTENT_ID]: string;
        [COLUMN_NAME_SOURCE_TYPE]: string;
        [COLUMN_NAME_TIME_STAMP]: number;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + PlaylistContentEntry.TABLE_NAME + ' (' +
            PlaylistContentEntry._ID + ' INTEGER  PRIMARY KEY ' + DbConstants.COMMA_SEP +
            PlaylistContentEntry.COLUMN_NAME_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            PlaylistContentEntry.COLUMN_NAME_PLAYLIST_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            PlaylistContentEntry.COLUMN_NAME_CONTENT_ID + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            PlaylistContentEntry.COLUMN_NAME_SOURCE_TYPE + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            PlaylistContentEntry.COLUMN_NAME_TIME_STAMP + DbConstants.SPACE + DbConstants.TEXT_TYPE +
            ' )';
    };

    export const insertQueryWithColumns: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}(
                    ${PlaylistContentEntry.COLUMN_NAME_IDENTIFIER},
                    ${PlaylistContentEntry.COLUMN_NAME_PLAYLIST_IDENTIFIER},
                    ${PlaylistContentEntry.COLUMN_NAME_CONTENT_ID},
                    ${PlaylistContentEntry.COLUMN_NAME_SOURCE_TYPE},
                    ${PlaylistContentEntry.COLUMN_NAME_TIME_STAMP}) 
                VALUES (?,?,?,?,?)`
    };

    export const readQuery:(() => string) = () => {
        return 'SELECT * FROM ' + TABLE_NAME;
    }

    export const insertQuery: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}`
    };
    
    export const deleteQuery: (() => string) = () => {
        return `DELETE FROM ${TABLE_NAME} WHERE 
                ${PlaylistContentEntry.COLUMN_NAME_IDENTIFIER} = ? AND 
                ${PlaylistContentEntry.COLUMN_NAME_PLAYLIST_IDENTIFIER} = ?`
    };
    export const deleteQueryOne: (() => string) = () => {
        return `DELETE FROM ${TABLE_NAME}`
    };

    export const deleteTable: (() => string) = () => {
        return 'DROP TABLE IF EXISTS' + PlaylistContentEntry.TABLE_NAME;
    };
}


