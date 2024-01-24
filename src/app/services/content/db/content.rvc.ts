import { ContentReactionsEntry } from "./content.reactions.schema";
import { ContentEntry } from "./content.schema";
import { RecentlyViewedContentEntry } from "./recently.viewed.content.schema";

export namespace ContentRVCEntry {
   
export type ContentRVCMixedSchemaMap = ContentEntry.SchemaMap & RecentlyViewedContentEntry.SchemaMap & ContentReactionsEntry.ReactionSchemaMap;


}


