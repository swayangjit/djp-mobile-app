import { ContentType, MimeType, TrackingEnabled } from "src/app/appConstants";

export class ContentUtil {
  
    public static isTrackable(content: any) {
      content = !content.trackable ? ((content.contentData && content.contentData.trackable) ? content.contentData : content) : content;
      // -1 - content, 0 - collection, 1 - enrolled (Trackable)
      if (content.trackable && content.trackable.enabled) {
        if (content.trackable.enabled === TrackingEnabled.YES) {
          // Trackable
          // if istrackable is defined, and true
          return 1;
        } else if (content.mimeType === MimeType.COLLECTION) {
          // Collection
          return 0;
        } else {
          // Content
          return -1;
        }
      } else {
        if (content.contentType && content.contentType.toLowerCase() === ContentType.COURSE.toLowerCase()) {
          // Trackable
          return 1;
        } else if (content.mimeType === MimeType.COLLECTION) {
          // Collection
          return 0;
        } else {
          // Content
          return -1;
        }
      }
    }
  }