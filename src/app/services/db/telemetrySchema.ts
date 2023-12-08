import { DbConstants } from "src/app/appConstants";

export namespace TelemetryConfigEntry {
    export const TABLE_NAME = 'telemtry';
    export const _ID = '_id';
    export const COLUMN_EVENT_TYPE = 'event_type';
    export const COLUMN_EVENT = 'event';
    export const COLUMN_TIMESTAMP = 'timestamp';
    export const COLUMN_PRIORITY = 'priority';

    export interface SchemaMap {
        [COLUMN_EVENT_TYPE]: string;
        [COLUMN_EVENT]: string;
        [COLUMN_TIMESTAMP]: string;
        [COLUMN_PRIORITY]: string;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' (' + TelemetryConfigEntry._ID +
            ' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL' + DbConstants.COMMA_SEP +
            COLUMN_EVENT_TYPE + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            COLUMN_EVENT + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            COLUMN_TIMESTAMP + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            COLUMN_PRIORITY + DbConstants.SPACE + DbConstants.INT_TYPE + ')';
    };

    export const readDataEntries:(() => string) = () => {
        return 'SELECT * FROM ' + TABLE_NAME;
    }

    
    export const delteFromTable: (() => string) = () => {
        return 'DELETE FROM ' + TABLE_NAME + ' WHERE ';
    }
    
    export const insertData: (() => string) = () => {
        return 'INSERT INTO ' + TABLE_NAME;
    }
    
    export const update: (() => string) = () => {
        return 'UPDATE ' + TABLE_NAME + ' SET ';
    }
    
    export const deleteTable: (() => string) = () => {
        return 'DROP TABLE IF EXISTS ' + TABLE_NAME;
    };
}


