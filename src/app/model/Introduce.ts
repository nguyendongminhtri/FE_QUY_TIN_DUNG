export class Introduce {
  id?: number;
  title?: string;
  content?: string;
  contentStoragePathsJson?: string;
  isShow?: boolean;
  constructor(title?: string,  content?: string,
              contentStoragePathsJson?: string,
             ) {
    this.title = title;
    this.content = content;
    this.contentStoragePathsJson = contentStoragePathsJson;
  }
}
