import { Content } from "src/app/services/content/models/content";
import { ContentRVCEntry } from "../db/content.rvc";
import { ContentEntry } from "../db/content.schema";
import { RecentlyViewedContent } from "../models/recently.viewed.content";

export class ContentRVCMixMapper {
    public static mapContentRVCtoRecentlyViedContent(schema: ContentRVCEntry.ContentRVCMixedSchemaMap, id: string): RecentlyViewedContent {
        const contentMetaData = JSON.parse(schema['content_metadata']);
        contentMetaData.isLiked = !!schema['reaction_identifier'];
        schema['content_metadata'] = JSON.stringify(contentMetaData);
        schema['metadata'] = schema['content_metadata'];
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