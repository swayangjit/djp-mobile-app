import { PlaylistEntry } from "../db/playlist.schema";

export class PlayListEntryMapper {
    public static mapContentToPlayListEntry(name: string, uid: string, playListId: string, contentCount: number): PlaylistEntry.SchemaMap {
        return {
            [PlaylistEntry.COLUMN_NAME_IDENTIFIER]: playListId,
            [PlaylistEntry.COLUMN_NAME_NAME]: name,
            [PlaylistEntry.COLUMN_NAME_UID]: uid,
            [PlaylistEntry.COLUMN_NAME_CONTENT_COUNT]: contentCount,
            [PlaylistEntry.COLUMN_NAME_TIME_STAMP]: Date.now(),
        };
    }

    public static mapContentToValues(identifier: string, playListId: string, contentId: string, sourceType: string, metaData: string): any[] {
        return [
            identifier,
            playListId,
            contentId,
            metaData,
            sourceType,
            Date.now(),
        ];
    }

}