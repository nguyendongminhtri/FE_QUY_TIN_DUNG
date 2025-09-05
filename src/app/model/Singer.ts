import {Nation} from "./Nation";

export class Singer{
  public name?:string;
  public sex?:string;
  public nation?:string;
  public birthday?:any
  public description?:string;
  public avatar?:string;
  public id?:number;


  constructor(name: string, sex: string, nation: string, birthday: any, description: string, avatar: string) {
    this.name = name;
    this.sex = sex;
    this.nation = nation;
    this.birthday = birthday;
    this.description = description;
    this.avatar = avatar;
  }
}
