import { DbConstants } from "src/app/appConstants";

export namespace ContentEntry {
   
    export const TABLE_NAME = 'content';
    export const _ID = '_id';
    export const COLUMN_NAME_IDENTIFIER = 'identifier';
    export const COLUMN_NAME_SOURCE = 'source';
    export const COLUMN_NAME_SOURCE_TYPE = 'source_type';
    export const COLUMN_NAME_METADATA = 'metadata';
    export const COLUMN_NAME_TIME_STAMP = 'ts';

    export interface SchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_IDENTIFIER]: string;
        [COLUMN_NAME_SOURCE]: string;
        [COLUMN_NAME_SOURCE_TYPE]: string;
        [COLUMN_NAME_METADATA]: string;
        [COLUMN_NAME_TIME_STAMP]: number;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + ContentEntry.TABLE_NAME + ' (' +
            ContentEntry._ID + ' INTEGER PRIMARY KEY ' + DbConstants.COMMA_SEP +
            ContentEntry.COLUMN_NAME_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE + + ' AUTO_INCREMENT'+DbConstants.COMMA_SEP +
            ContentEntry.COLUMN_NAME_SOURCE + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            ContentEntry.COLUMN_NAME_SOURCE_TYPE + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            ContentEntry.COLUMN_NAME_METADATA + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            ContentEntry.COLUMN_NAME_TIME_STAMP + DbConstants.SPACE + DbConstants.TEXT_TYPE +
            ' )';
    };
    export const deleteQuery: (() => string) = () => {
        return 'DELETE FROM ' + ContentEntry.TABLE_NAME;
    };
    export const readQuery:(() => string) = () => {
        return 'SELECT * FROM ' + TABLE_NAME;
    }

    export const insertQuery: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}(
            ${ContentEntry.COLUMN_NAME_IDENTIFIER},
            ${ContentEntry.COLUMN_NAME_SOURCE},
            ${ContentEntry.COLUMN_NAME_SOURCE_TYPE},
            ${ContentEntry.COLUMN_NAME_METADATA},
            ${ContentEntry.COLUMN_NAME_TIME_STAMP}) VALUES (?,?,?,?,?)`
    };
}


