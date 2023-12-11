export interface Content {
    source: string;
    sourceType: string;
    metaData: ContentMetaData
}

export interface ContentMetaData {
    identifier: string;
    name: string;
    thumbnail: string;
    description: string;
    mimeType: string;
    url: string;
    focus: string;
    keyword: string;
}