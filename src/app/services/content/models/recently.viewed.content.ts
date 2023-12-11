import { Content } from "./content";

export interface RecentlyViewed {
    uid: string;
    rvIdentifier: string
    contentIdentifier: string
} 

export type RecentlyViewedContent = RecentlyViewed & Content;