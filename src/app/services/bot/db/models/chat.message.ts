export interface ChatMessage {
    identifier: string;
    message: string;
    messageType: string;
    botType: string;
    fromMe: number;
    mediaMimeType: string;
    mediaData: string;
    mediaUrl: string;
    duration?: string;
    ts: string;
    requestId?: string;
    reaction: number;
}