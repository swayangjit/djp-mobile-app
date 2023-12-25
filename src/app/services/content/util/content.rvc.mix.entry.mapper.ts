import { Content } from "src/app/services/content/models/content";
import { ContentRVCEntry } from "../db/content.rvc";
import { ContentEntry } from "../db/content.schema";
import { RecentlyViewedContent } from "../models/recently.viewed.content";

export class ContentRVCMixMapper {
    public static mapContentRVCtoRecentlyViedContent(schema: ContentRVCEntry.ContentRVCMixedSchemaMap, id: string): RecentlyViewedContent {
        return {
            uid: schema.uid,
            rvIdentifier: id,
            contentIdentifier: schema.identifier,
            source: schema.source,
            sourceType: schema.source_type,
            metaData: JSON.parse(schema.content_metadata)
        };
    }
}