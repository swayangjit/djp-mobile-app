export interface Config {
    pageConfig: Array<PageConfig>,
    languages: Language[];
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
