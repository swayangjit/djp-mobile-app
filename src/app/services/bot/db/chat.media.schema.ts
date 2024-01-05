import { DbConstants } from "src/app/appConstants";

export namespace ChatMediaEntry {

    export const TABLE_NAME = 'chat_media';
    export const _ID = '_id';
    export const COLUMN_NAME_IDENTIFIER = 'identifier';
    export const COLUMN_NAME_NAME = 'name';
    export const COLUMN_NAME_MIME_TYPE = 'mime_type';
    export const COLUMN_NAME_DATA = 'data';
    export const COLUMN_NAME_DURATION = 'duration';

    export interface SchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_IDENTIFIER]: string;
        [COLUMN_NAME_NAME]: string;
        [COLUMN_NAME_MIME_TYPE]: string;
        [COLUMN_NAME_DURATION]?: number;
        [COLUMN_NAME_DATA]: string;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + ChatMediaEntry.TABLE_NAME + ' (' +
            ChatMediaEntry._ID + ' INTEGER  PRIMARY KEY AUTOINCREMENT' + DbConstants.COMMA_SEP +
            ChatMediaEntry.COLUMN_NAME_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            ChatMediaEntry.COLUMN_NAME_NAME + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            ChatMediaEntry.COLUMN_NAME_MIME_TYPE + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            ChatMediaEntry.COLUMN_NAME_DATA + DbConstants.SPACE + DbConstants.TEXT_TYPE +
            ' )';
    };

    export const readQuery: (() => string) = () => {
        return 'SELECT * FROM ' + TABLE_NAME;
    }

    export const insertQuery: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}`
    };

    export const insertQueryWithColumns: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}(
                    ${ChatMediaEntry.COLUMN_NAME_IDENTIFIER},
                    ${ChatMediaEntry.COLUMN_NAME_IDENTIFIER},
                    ${ChatMediaEntry.COLUMN_NAME_NAME},
                    ${ChatMediaEntry.COLUMN_NAME_MIME_TYPE},
                    ${ChatMediaEntry.COLUMN_NAME_DATA}) 
                VALUES (?,?,?,?,?)`
    };

    export const updateQuery: (() => string) = () => {
        return `UPDATE ${TABLE_NAME} SET`
    };

    export const deleteQuery: (() => string) = () => {
        return 'DELETE FROM ' + TABLE_NAME;
    };
}


