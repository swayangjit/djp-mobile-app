import { DbConstants } from "src/app/appConstants";

export namespace ContentReactionsEntry {

    export const TABLE_NAME = 'content_reactions';
    export const _ID = '_id';
    export const COLUMN_NAME_CONTENT_IDENTIFIER = 'content_identifier';
    export const COLUMN_NAME_REACTION_IDENTIFIER = 'reaction_identifier';
    export const COLUMN_NAME_UID = 'uid';
    export const COLUMN_NAME_TIME_STAMP = 'ts';

    export interface SchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_CONTENT_IDENTIFIER]: string;
        [COLUMN_NAME_UID]: string;
        [COLUMN_NAME_TIME_STAMP]: number;
    }

    export interface ReactionSchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_REACTION_IDENTIFIER]: string;
        [COLUMN_NAME_UID]: string;
        [COLUMN_NAME_TIME_STAMP]: number;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + ContentReactionsEntry.TABLE_NAME + ' (' +
            ContentReactionsEntry._ID + ' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL' + DbConstants.COMMA_SEP +
            ContentReactionsEntry.COLUMN_NAME_CONTENT_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            ContentReactionsEntry.COLUMN_NAME_UID + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            ContentReactionsEntry.COLUMN_NAME_TIME_STAMP + DbConstants.SPACE + DbConstants.TEXT_TYPE +
            ' )';
    };
    export const deleteQuery: (() => string) = () => {
        return 'DELETE FROM ' + ContentReactionsEntry.TABLE_NAME;
    };
    export const readQuery: (() => string) = () => {
        return 'SELECT * FROM ' + TABLE_NAME;
    }

    export const updateQuery: (() => string) = () => {
        return `UPDATE ${TABLE_NAME} SET`
    };

    export const insertQueryWithColoumns: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}(
            ${ContentReactionsEntry.COLUMN_NAME_CONTENT_IDENTIFIER},
            ${ContentReactionsEntry.COLUMN_NAME_UID},
            ${ContentReactionsEntry.COLUMN_NAME_TIME_STAMP}) VALUES (?,?,?)`
    };

    export const insertQuery: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}`
    };
}


