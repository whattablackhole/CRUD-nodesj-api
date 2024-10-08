import { UUID } from "crypto";

export class User {
  public id: UUID;
  public username: string;
  public age: number;
  public hobbies: string[];
}
