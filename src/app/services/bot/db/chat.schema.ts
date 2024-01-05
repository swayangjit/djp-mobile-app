import { DbConstants } from "src/app/appConstants";

export namespace BotChatEntry {

    export const TABLE_NAME = 'chat';
    export const _ID = '_id';
    export const COLUMN_NAME_IDENTIFIER = 'identifier';
    export const COLUMN_NAME_MESSAGE = 'message';
    export const COLUMN_NAME_BOT_TYPE = 'bot_type';
    export const COLUMN_NAME_FROM_ME = 'from_me';
    export const COLUMN_NAME_REACTIONS = 'reactions';
    export const COLUMN_NAME_REQUEST_ID = 'request_id';
    export const COLUMN_NAME_MEDIA_TYPE = 'media_type';
    export const COLUMN_NAME_MEDIA_DATA = 'media_data';
    export const COLUMN_NAME_MEDIA_PATH = 'media_path';
    export const COLUMN_NAME_DURATION = 'duration';
    export const COLUMN_NAME_TIME_STAMP = 'ts';

    export interface SchemaMap {
        [_ID]?: string;
        [COLUMN_NAME_IDENTIFIER]: string;
        [COLUMN_NAME_MESSAGE]: string;
        [COLUMN_NAME_BOT_TYPE]: string;
        [COLUMN_NAME_FROM_ME]: number;
        [COLUMN_NAME_REACTIONS]: number;
        [COLUMN_NAME_REQUEST_ID]: string;
        [COLUMN_NAME_MEDIA_TYPE]: string;
        [COLUMN_NAME_MEDIA_DATA]: string;
        [COLUMN_NAME_MEDIA_PATH]: string;
        [COLUMN_NAME_DURATION]: string;
        [COLUMN_NAME_TIME_STAMP]: string;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + BotChatEntry.TABLE_NAME + ' (' +
            BotChatEntry._ID + ' INTEGER  PRIMARY KEY AUTOINCREMENT' + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_IDENTIFIER + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_MESSAGE + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_BOT_TYPE + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_FROM_ME + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_REACTIONS + DbConstants.SPACE + DbConstants.INT_TYPE + ' DEFAULT -1' + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_REQUEST_ID + DbConstants.SPACE + DbConstants.TEXT_TYPE  + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_MEDIA_TYPE + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_MEDIA_DATA + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_MEDIA_PATH + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_DURATION + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            BotChatEntry.COLUMN_NAME_TIME_STAMP + DbConstants.SPACE + DbConstants.TEXT_TYPE +
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
                    ${BotChatEntry.COLUMN_NAME_IDENTIFIER},
                    ${BotChatEntry.COLUMN_NAME_MESSAGE},
                    ${BotChatEntry.COLUMN_NAME_BOT_TYPE},
                    ${BotChatEntry.COLUMN_NAME_FROM_ME},
                    ${BotChatEntry.COLUMN_NAME_MEDIA_TYPE},
                    ${BotChatEntry.COLUMN_NAME_MEDIA_DATA},
                    ${BotChatEntry.COLUMN_NAME_MEDIA_PATH},
                    ${BotChatEntry.COLUMN_NAME_DURATION},
                    ${BotChatEntry.COLUMN_NAME_TIME_STAMP},
                    ${BotChatEntry.COLUMN_NAME_REACTIONS}) 
                VALUES (?,?,?,?,?,?,?,?,?,?)`
    };

    export const updateQuery: (() => string) = () => {
        return `UPDATE ${TABLE_NAME} SET`
    };

    export const deleteQuery: (() => string) = () => {
        return 'DELETE FROM ' + TABLE_NAME;
    };
}


