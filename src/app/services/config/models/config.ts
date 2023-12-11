export interface Config {
    sourceConfig: SourceConfig;
    metadataMapping: MetadataMapping;
    filters: Array<Filter>;
    languages: Language[];
}

export interface Filter {
    identifier: string;
    label: string;
    index: number;
    active: boolean;
}

export interface Language {
    identifier: string;
    label: string;
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
