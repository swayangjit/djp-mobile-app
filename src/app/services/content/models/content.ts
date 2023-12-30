export interface Content {
    source: string;
    sourceType: string;
    metaData: ContentMetaData
}

export interface ContentMetaData {
    identifier: string;
    name: string;
    thumbnail: string;
    description?: string;
    mimetype: string;
    url: string;
    domain?: string,
    curriculargoal?: null,
    competencies?: null,
    language?: string,
    category?: string,
    audience?: Array<any>,
    focus?: string;
    keyword?: any;
    status?: string,
    createdon?: string,
    lastupdatedon?: string,
    artifactUrl?: string,
    isLiked?: boolean
}