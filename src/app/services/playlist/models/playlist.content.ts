import { Content } from "../../content/models/content";

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
    playListcontentList: Array<PlayListContentMix>;
} 

export type PlayListContentMix = PlayListContent & Content;