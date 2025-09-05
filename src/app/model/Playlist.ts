
import {Song} from "./Song";

export class Playlist {
  public id?:number;
  public name?: string;
  public avatar?: string;
  public songList: Song[] = [];


  constructor(name: string, avatar: string, songList: Song[]) {
    this.name = name;
    this.avatar = avatar;
    this.songList = songList;
  }
}
