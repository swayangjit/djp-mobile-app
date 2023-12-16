import { DbConstants } from "src/app/appConstants";

export namespace PlaylistEntry {
   
    export const TABLE_NAME = 'playlist';
    export const _ID = '_id';
    export const COLUMN_NAME_IDENTIFIER = 'identifier';
    export const COLUMN_NAME_NAME = 'name';
    export const COLUMN_NAME_UID = 'uid';
    export const COLUMN_NAME_CONTENT_COUNT = 'content_count';
    export const COLUMN_NAME_TIME_STAMP = 'ts';

    export interface SchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_IDENTIFIER]: string;
        [COLUMN_NAME_NAME]: string;
        [COLUMN_NAME_UID]: string;
        [COLUMN_NAME_CONTENT_COUNT]: number;
        [COLUMN_NAME_TIME_STAMP]: number;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + PlaylistEntry.TABLE_NAME + ' (' +
            PlaylistEntry._ID + ' INTEGER  PRIMARY KEY ' + DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE +DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_UID    + DbConstants.SPACE + DbConstants.TEXT_TYPE +DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_NAME + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_CONTENT_COUNT + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            PlaylistEntry.COLUMN_NAME_TIME_STAMP + DbConstants.SPACE + DbConstants.TEXT_TYPE +
            ' )';
    };
    export const insertQueryWithColumns: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}(
                    ${PlaylistEntry.COLUMN_NAME_IDENTIFIER},
                    ${PlaylistEntry.COLUMN_NAME_NAME},
                    ${PlaylistEntry.COLUMN_NAME_UID},
                    ${PlaylistEntry.COLUMN_NAME_CONTENT_COUNT},
                    ${PlaylistEntry.COLUMN_NAME_TIME_STAMP}) 
                VALUES (?,?,?,?,?)`
    };

    export const readQuery:(() => string) = () => {
        return 'SELECT * FROM ' + TABLE_NAME;
    }

    export const insertQuery: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}`
    };

    export const updateQuery: (() => string) = () => {
        return `UPDATE ${TABLE_NAME} SET`
    };

    export const deleteQuery: (() => string) = () => {
        return 'DELETE FROM ' + PlaylistEntry.TABLE_NAME;
    };
}


