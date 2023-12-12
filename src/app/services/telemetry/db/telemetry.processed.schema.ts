import { DbConstants } from "src/app/appConstants";

export namespace TelemetryProcessedEntry {

    export const _ID = '_id';
    export const TABLE_NAME = 'processed_telemetry';
    export const COLUMN_NAME_MSG_ID = 'msg_id';
    export const COLUMN_NAME_DATA = 'data';
    export const COLUMN_NAME_NUMBER_OF_EVENTS = 'event_count';
    export const COLUMN_NAME_PRIORITY = 'priority';

    export interface SchemaMap {
        [_ID]: string;
        [COLUMN_NAME_MSG_ID]: string;
        [COLUMN_NAME_DATA]: string;
        [COLUMN_NAME_NUMBER_OF_EVENTS]: number;
        [COLUMN_NAME_PRIORITY]: number;
    }

    export const getCreateEntry: (() => string) = () => {
        return 'CREATE TABLE IF NOT EXISTS ' + TelemetryProcessedEntry.TABLE_NAME + ' (' +
            TelemetryProcessedEntry._ID + ' INTEGER PRIMARY KEY,' +
            TelemetryProcessedEntry.COLUMN_NAME_MSG_ID + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            TelemetryProcessedEntry.COLUMN_NAME_DATA + DbConstants.SPACE + DbConstants.TEXT_TYPE + DbConstants.COMMA_SEP +
            TelemetryProcessedEntry.COLUMN_NAME_NUMBER_OF_EVENTS + DbConstants.SPACE + DbConstants.INT_TYPE + DbConstants.COMMA_SEP +
            TelemetryProcessedEntry.COLUMN_NAME_PRIORITY + DbConstants.SPACE + DbConstants.INT_TYPE +
            ' )';
    };

    export const insertQuery: (() => string) = () => {
        return `INSERT INTO ${TABLE_NAME}`
    };

    export const getDeleteEntry: (() => string) = () => {
        return 'DROP TABLE IF EXISTS ' + TelemetryProcessedEntry.TABLE_NAME;
    };
}