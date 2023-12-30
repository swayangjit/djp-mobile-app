import { DbConstants } from "src/app/appConstants";

export namespace RecentlyViewedContentEntry {
   
    export const TABLE_NAME = 'recently_viewed_content';
    export const _ID = '_id';
    export const COLUMN_NAME_IDENTIFIER = 'identifier';
    export const COLUMN_NAME_CONTENT_IDENTIFIER = 'content_identifier';
    export const COLUMN_NAME_CONTENT_METADATA = 'content_metadata';
    export const COLUMN_NAME_UID = 'uid';
    export const COLUMN_NAME_MIME_TYPE = 'mime_type';
    export const COLUMN_NAME_TIME_STAMP = 'ts';

    export interface SchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_IDENTIFIER]: string;
        [COLUMN_NAME_CONTENT_IDENTIFIER]: string;
        [COLUMN_NAME_CONTENT_METADATA]: string;
        [COLUMN_NAME_UID]: string;
        [COLUMN_NAME_MIME_TYPE]: string;
        [COLUMN_NAME_TIME_STAMP]: number;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + RecentlyViewedContentEntry.TABLE_NAME + ' (' +
            RecentlyViewedContentEntry._ID + ' INTEGER PRIMARY KEY' + DbConstants.COMMA_SEP +
            RecentlyViewedContentEntry.COLUMN_NAME_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE +DbConstants.COMMA_SEP +
            RecentlyViewedContentEntry.COLUMN_NAME_CONTENT_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE +DbConstants.COMMA_SEP +
            RecentlyViewedContentEntry.COLUMN_NAME_CONTENT_METADATA + DbConstants.SPACE + DbConstants.TEXT_TYPE +DbConstants.COMMA_SEP +
            RecentlyViewedContentEntry.COLUMN_NAME_UID + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            RecentlyViewedContentEntry.COLUMN_NAME_MIME_TYPE + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            RecentlyViewedContentEntry.COLUMN_NAME_TIME_STAMP + DbConstants.SPACE + DbConstants.TEXT_TYPE +
            ' )';
    };

    export const readQuery:(() => string) = () => {
        return 'SELECT * FROM ' + TABLE_NAME;
    }
    
    export const deleteTable: (() => string) = () => {
        return 'DROP TABLE IF EXISTS' + RecentlyViewedContentEntry.TABLE_NAME;
    };

    export const insertQueryWithColumns: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}(
                    ${RecentlyViewedContentEntry.COLUMN_NAME_IDENTIFIER},
                    ${RecentlyViewedContentEntry.COLUMN_NAME_CONTENT_IDENTIFIER},
                    ${RecentlyViewedContentEntry.COLUMN_NAME_UID},
                    ${RecentlyViewedContentEntry.COLUMN_NAME_CONTENT_METADATA},
                    ${RecentlyViewedContentEntry.COLUMN_NAME_MIME_TYPE},
                    ${RecentlyViewedContentEntry.COLUMN_NAME_TIME_STAMP}) VALUES (?,?,?,?,?,?)`
    };

    export const insertQuery: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}`
    };

    export const updateQuery: (() => string) = () => {
        return `UPDATE ${TABLE_NAME} SET`
    };

    
}


