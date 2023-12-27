import { Content } from "src/app/services/content/models/content";
import { ContentReactionsEntry } from "../db/content.reactions.schema";
import { ContentEntry } from "../db/content.schema";

export class ContentMapper {
    public static mapContentToContentEntry(content: Content): ContentEntry.SchemaMap {
        return {
            [ContentEntry.COLUMN_NAME_IDENTIFIER]: content.metaData.identifier,
            [ContentEntry.COLUMN_NAME_SOURCE]: content.source,
            [ContentEntry.COLUMN_NAME_SOURCE_TYPE]: content.sourceType,
            [ContentEntry.COLUMN_NAME_METADATA]: JSON.stringify(content.metaData),
            [ContentEntry.COLUMN_NAME_TIME_STAMP]: Date.now(),
        };
    }

    public static mapContentToValues(content: Content): any[] {
        return [
            content.metaData.identifier,
            content.source,
            content.sourceType,
            JSON.stringify(content.metaData),
            Date.now(),
        ];
    }

    public static mapContentReactionEntry(identifier: string, uid: string): ContentReactionsEntry.SchemaMap {
        return {
            [ContentReactionsEntry.COLUMN_NAME_CONTENT_IDENTIFIER]: identifier,
            [ContentReactionsEntry.COLUMN_NAME_UID]: uid,
            [ContentReactionsEntry.COLUMN_NAME_TIME_STAMP]: Date.now(),
        };
    }
}