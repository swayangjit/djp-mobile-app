export interface HeaderConfig {
    showHeader: boolean,
    pageTitle: String,
    showbackButton: boolean
}
export const sidebarMenuItems = [
    "All",
    "Make a Story",
    "Ask a doubt",
    "Parents",
    "Teachers",
    "Divyang",
    "Tribal",
    "Lullabies",
    "Games"
]

export const dbinfo = {
    dbName: 'digital_jaddu_pitara.db',
    version: 3
}

export class APIConstants {
    static BASE_URL = 'http://152.67.162.156:9000/';
    static CONFIG = 'config/v1/read';
    static SEARCH_API = 'api/content/v1/search';
    static TELEMETRY_SYNC = 'v1/telemetry';
}

export class DbConstants {
    static DATE_TYPE = 'DATE';
    static TEXT_TYPE = 'TEXT';
    static INT_TYPE = 'INTEGER';
    static REAL_TYPE = 'REAL';
    static COMMA_SEP = ',';
    static SPACE = ' ';
    static MAX_NUM_OF_EVENTS = 1000;
    static MAX_NUM_OF_PROCESSED_EVENTS = 1;
    static ERROR = 'DB_ERROR';
    static BLOB_TYPE = 'BLOB';
    static NOT_NULL = 'NOT NULL';
    static NULL = 'NULL';
}

export interface ContentSrc {
    name: string,
    liked: boolean,
    type: string
}

export interface Filter {
    label: string,
    identifier: string,
    index: number,
    active: boolean
}

export interface Language {
    identifier: string,
    label: string,
    selected: boolean
}

export interface Content {
    source: string;
    sourceType: string;
    metaData: ContentMetaData;
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


export const request = {
    "request": {
        "filters": {
            "channel": "01246375399411712074",
            "primaryCategory": [
                "Collection",
                "Resource",
                "Content Playlist",
                "Course",
                "Course Assessment",
                "Digital Textbook",
                "eTextbook",
                "Explanation Content",
                "Learning Resource",
                "Practice Question Set",
                "Teacher Resource",
                "Textbook Unit",
                "LessonPlan",
                "FocusSpot",
                "Learning Outcome Definition",
                "Curiosity Questions",
                "MarkingSchemeRubric",
                "ExplanationResource",
                "ExperientialResource",
                "Practice Resource",
                "TVLesson",
                "Question paper"
            ],
            "visibility": [
                "Default",
                "Parent"
            ]
        },
        "limit": 100,
        "query": "N2W6V1",
        "sort_by": {
            "lastPublishedOn": "desc"
        },
        "fields": [
            "name",
            "appIcon",
            "mimeType",
            "gradeLevel",
            "identifier",
            "medium",
            "pkgVersion",
            "board",
            "subject",
            "resourceType",
            "primaryCategory",
            "contentType",
            "channel",
            "organisation",
            "trackable"
        ],
        "softConstraints": {
            "badgeAssertions": 98,
            "channel": 100
        },
        "mode": "soft",
        "facets": [
            "se_boards",
            "se_gradeLevels",
            "se_subjects",
            "se_mediums",
            "primaryCategory"
        ],
        "offset": 0
    }
}
export interface sourceConfig {
    sourceType: string,
    sourceName: string,
    baseURL: string,
    sbVersion: string,
    searchCriteria: {
        filters: {
            keywords: Array<any>,
            primaryCategory: Array<any>,
            mimeType: Array<string>
        },
        sort_by: {
            lastPublishedOn: string
        }
    }
}