import { Content } from "src/app/services/content/models/content";
import { RecentlyViewedContentEntry } from "../db/recently.viewed.content.schema";

export class RecentlyViewedContentMapper {
    public static mapContentToRecentlyViewedContentEntry(content: Content, uid: string, identifier: string): RecentlyViewedContentEntry.SchemaMap {
        return {
            [RecentlyViewedContentEntry.COLUMN_NAME_IDENTIFIER]: identifier,
            [RecentlyViewedContentEntry.COLUMN_NAME_CONTENT_IDENTIFIER]: content.metaData.identifier,
            [RecentlyViewedContentEntry.COLUMN_NAME_UID]: uid,
            [RecentlyViewedContentEntry.COLUMN_NAME_CONTENT_METADATA]: JSON.stringify(content.metaData),
            [RecentlyViewedContentEntry.COLUMN_NAME_MIME_TYPE]: content.metaData.mimetype,
            [RecentlyViewedContentEntry.COLUMN_NAME_TIME_STAMP]: Date.now(),
        };
    }

    public static mapContentToValues(content: Content, uid: string): any[] {
        return [
            content.metaData.identifier,
            uid,
            content.metaData.mimetype,
            Date.now(),
        ];
    }
}


