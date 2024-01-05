import { BotChatEntry } from "../chat.schema";
import { ChatMessage } from "../models/chat.message";

export class BotChatEntryMapper {

    public static mapChatToChatValues(chatMessage: ChatMessage): any[] {
        return [
            chatMessage.identifier,
            chatMessage.message,
            chatMessage.botType,
            chatMessage.fromMe,
            chatMessage.mediaMimeType,
            chatMessage.mediaData,
            chatMessage.mediaUrl,
            chatMessage.duration,
            chatMessage.ts,
            chatMessage.reaction
        ]
    }

    public static mapChatToChatEntryToModel(chatEntry: any): ChatMessage {
        return {
            identifier: chatEntry[BotChatEntry.COLUMN_NAME_IDENTIFIER],
            message: chatEntry[BotChatEntry.COLUMN_NAME_MESSAGE],
            messageType: chatEntry[BotChatEntry.COLUMN_NAME_MEDIA_TYPE],
            botType: chatEntry[BotChatEntry.COLUMN_NAME_BOT_TYPE],
            fromMe: chatEntry[BotChatEntry.COLUMN_NAME_FROM_ME],
            mediaMimeType: chatEntry[BotChatEntry.COLUMN_NAME_MEDIA_TYPE],
            mediaData: chatEntry[BotChatEntry.COLUMN_NAME_MEDIA_DATA],
            mediaUrl: chatEntry[BotChatEntry.COLUMN_NAME_MEDIA_PATH],
            duration: chatEntry[BotChatEntry.COLUMN_NAME_DURATION],
            ts: chatEntry[BotChatEntry.COLUMN_NAME_TIME_STAMP],
            reaction: chatEntry[BotChatEntry.COLUMN_NAME_REACTIONS]
        }
    }
}