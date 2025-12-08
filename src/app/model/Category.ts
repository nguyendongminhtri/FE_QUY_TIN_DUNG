export class Category{
  public id? : number;
  public name?:string;
  public type?:string;
  public emoji?:string;
  constructor( name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}
