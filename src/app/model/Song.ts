import {Category} from "./Category";
import {Singer} from "./Singer";

export class Song {
  public id?:number;
  public name?: string;
  public avatar?: string;
  public lyrics?: string;
  public url?: string;
  public category?:Category;
  public singerList:Singer[] = [];
  public time?: number;


  constructor(name: string, avatar: string, lyrics: string, url: string, category: Category, singerList: Singer[]) {
    this.name = name;
    this.avatar = avatar;
    this.lyrics = lyrics;
    this.url = url;
    this.category = category;
    this.singerList = singerList;
  }
}
