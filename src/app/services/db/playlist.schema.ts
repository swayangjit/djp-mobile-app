import { DbConstants } from "src/app/appConstants";

export namespace PlaylistEntry {
   
    export const TABLE_NAME = 'playlist';
    export const _ID = '_id';
    export const COLUMN_NAME_IDENTIFIER = 'identifier';
    export const COLUMN_NAME_NAME = 'name';
    export const COLUMN_NAME_CONTENT_ID = 'content_id';
    export const COLUMN_NAME_TIME_STAMP = 'ts';

    export interface SchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_IDENTIFIER]: string;
        [COLUMN_NAME_NAME]: string;
        [COLUMN_NAME_CONTENT_ID]: string;
        [COLUMN_NAME_TIME_STAMP]: number;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + PlaylistEntry.TABLE_NAME + ' (' +
            PlaylistEntry._ID + ' INTEGER AUTO_INCREMENT' + DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE +DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_CONTENT_ID + DbConstants.SPACE + DbConstants.TEXT_TYPE +DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_NAME + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_TIME_STAMP + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            'PRIMARY KEY ('+PlaylistEntry.COLUMN_NAME_IDENTIFIER+','+ PlaylistEntry.COLUMN_NAME_CONTENT_ID+')'+
            ' )';
    };
    export const deleteTable: (() => string) = () => {
        return 'DROP TABLE IF EXISTS' + PlaylistEntry.TABLE_NAME;
    };
}


