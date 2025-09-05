import {Song} from "./Song";

export class Album {
  public id?:number;
  public name?: string;
  public avatar?: string;

  constructor(name: string, avatar: string) {
    this.name = name;
    this.avatar = avatar;
  }
}
