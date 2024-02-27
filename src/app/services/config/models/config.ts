export interface Config {
    pageConfig: Array<PageConfig>,
    languages: Language[];
    notification: {
        android: Notification
    };
}

export interface PageConfig {
    pageId: string,
    defaultFilter: {
        id: string,
        label: string,
        query: any,
        filters: any
    },
    additionalFilters: Array<Filter>
}

export interface Filter {
    id: string,
    label: string,
    query: any,
    filters: any,
    index: number,
}

export interface Language {
    id: string,
    label: string,
    default: boolean
}

export interface Notification {
    id: number,
    title: string,
    body: string,
    extra: string,
    largeIcon?: string,
    smallIcon?: string,
    schedule: {
        on: {year?: number;
            month?: number;
            day?: number;
            weekday?: Weekday;
            hour?: number;
            minute?: number;
            second?: number;},
        repeats: boolean,
        every: 'year' | 'month' | 'two-weeks' | 'week' | 'day' | 'hour' | 'minute' | 'second',
        allowWhileIdle: boolean
    }
}
export declare enum Weekday {
    Sunday = 1,
    Monday = 2,
    Tuesday = 3,
    Wednesday = 4,
    Thursday = 5,
    Friday = 6,
    Saturday = 7
}
export interface MetadataMapping {
    mappingVersion: number;
    mappings: Array<MappingElement>;
}

export interface MappingElement {
    sourceType: string;
    mapping: Mapping;
}

export interface Mapping {
    identifier: string;
    name: string;
    thumbnail: string;
    description: string;
    mimeType: string;
    url: string;
    focus: string;
    keywords: string;
}

export interface SourceConfig {
    configVersion: number;
    sources: Source[];
}

export interface Source {
    sourceType: string;
    sourceName: string;
    baseURL: string;
    sbVersion: string;
    searchCriteria: any;
}
