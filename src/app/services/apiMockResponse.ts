export const contentMock = {
    "id": "api.source-config.read",
    "params": {
        "resmsgid": "963690c2-2f7c-4675-893f-49920b0ab31b",
        "msgid": "939f2d32-26ab-4a37-ae1f-d49da3736f8b"
    },
    "responseCode": "OK",
    "result": {
        "sourceConfig": {
            "configVersion": 1,
            "sources": [
                {
                    "sourceType": "sunbird",
                    "sourceName": "DIKSHA",
                    "baseURL": "https://diksha.gov.in",
                    "sbVersion": "5.2",
                    "searchCriteria": {
                        "filters": {
                            "keywords": [],
                            "primaryCategory": [],
                            "mimeType": [
                                "application/pdf",
                                "video/mp4",
                                "audio/mp3",
                                "video/x-youtube"
                            ]
                        },
                        "sort_by": {
                            "lastPublishedOn": "desc"
                        }
                    }
                }
            ]
        },
        "metadataMapping": {
            "mappingVersion": 1,
            "mappings": [
                {
                    "sourceType": "sunbird",
                    "mapping": {
                        "identifier": "identifier",
                        "name": "name",
                        "thumbnail": "appIcon",
                        "description": "description",
                        "mimeType": "mimeType",
                        "url": "streamingUrl",
                        "focus": "audience",
                        "keywords": "keywords"
                    }
                }
            ]
        },
        "filters": [
            {
                "identifier": "activity",
                "label": "Activity",
                "index": 1
            },
            {
                "identifier": "stories",
                "label": "Stories",
                "index": 2
            },
            {
                "identifier": "rhymes",
                "label": "Rhymes",
                "index": 3
            }
        ],
        "languages": [
            {
                "identifier": "hi",
                "label": "हिंदी"
            },
            {
                "identifier": "en",
                "label": "English"
            }
        ]
    }
}