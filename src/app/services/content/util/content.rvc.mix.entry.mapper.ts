import { Content } from "src/app/services/content/models/content";
import { ContentRVCEntry } from "../db/content.rvc";
import { ContentEntry } from "../db/content.schema";
import { RecentlyViewedContent } from "../models/recently.viewed.content";

export class ContentRVCMixMapper {
    public static mapContentRVCtoRecentlyViedContent(schema: ContentRVCEntry.ContentRVCMixedSchemaMap): RecentlyViewedContent{
        return {
            uid: schema.uid,
            contentIdentifier: schema.identifier,
            source: schema.source,
            sourceType: schema.source_type,
            metaData: JSON.parse(schema.metadata)
        };
    }
}