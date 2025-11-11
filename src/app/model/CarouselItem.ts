export class CarouselItem {
  id?: number;
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  imageStoragePath?: string;
  contentStoragePathsJson?: string [];
  isShow?: boolean;
  constructor(title?: string, description?: string, content?: string, imageUrl?: string, imageStoragePath?: string, contentStoragePathsJson?: string []) {
    this.title = title;
    this.description = description;
    this.content = content;
    this.imageUrl = imageUrl;
    this.imageStoragePath = imageStoragePath;
    this.contentStoragePathsJson = contentStoragePathsJson;
  }
}
