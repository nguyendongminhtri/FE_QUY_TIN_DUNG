import {Category} from "./Category";

export class Product {
  id?: number;
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  imageStoragePath?: string;
  contentStoragePathsJson?: string;
  isShow?: boolean;
  category?: Category;
  constructor(title?: string, description?: string, content?: string,
              imageUrl?: string, imageStoragePath?: string,
              contentStoragePathsJson?: string,
              category?: Category) {
    this.title = title;
    this.description = description;
    this.content = content;
    this.imageUrl = imageUrl;
    this.imageStoragePath = imageStoragePath;
    this.contentStoragePathsJson = contentStoragePathsJson;
    this.category = category;
  }
}
