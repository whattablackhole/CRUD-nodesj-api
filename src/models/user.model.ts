import { UUID } from "crypto";

export class User {
  public id: UUID;
  public username: string;
  public age: number;
  public hobbies: string[];
  
  constructor(id: UUID, username: string, age: number, hobbies: string[]) {
    this.id = id;
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }
}
