import { Content } from "../../content/models/content";
import { PlaylistContentEntry } from "../db/playlist.content.schema";

export interface PlayListContent {
    identifier: string;
    type:  'recentlyViewed' | 'local' | 'content';
    localContent ?: Content;
    isDeleted?: boolean;
}
 

export interface PlayList {
    identifier: string;
    name: string
    uid: string;
    playListcontentList: Array<PlaylistContentEntry.SchemaMap>;
} 

export type PlayListContentMix = PlayListContent & Content;