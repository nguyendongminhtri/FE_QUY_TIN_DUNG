export class CarouselItem {
  id?: number;
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  isShow?: boolean;
  constructor(title?: string, description?: string, content?: string, imageUrl?: string) {
    this.title = title;
    this.description = description;
    this.content = content;
    this.imageUrl = imageUrl;
  }
}
