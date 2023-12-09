import { Content } from "./content";

export interface RecentlyViewed {
    uid: string;
    contentIdentifier: string
} 

export type RecentlyViewedContent = RecentlyViewed & Content;