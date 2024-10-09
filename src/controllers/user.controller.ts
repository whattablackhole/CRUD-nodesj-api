import { randomUUID, UUID } from "crypto";
import { httpMeta, httpController } from "../decorators/http.js";
import { UserCreate } from "../schemas/user.schemas.js";
import { User } from "../models/user.model.js";
import DbClient from "../database/client.js";
import HttpResponse from "../http/response.js";
import { isCreateUserValidator } from "../validators/user.validator.js";

export default class UserController {
  private db: DbClient;

  constructor(db: DbClient) {
    this.db = db;
  }

  @httpMeta("GET", "/{id:uuid}")
  @httpController()
  public async getUser({id}: { id: UUID }) {
    const dbResponse = await this.db.hGet(`user:${id}`);
    return new HttpResponse(200, dbResponse.data);
  }

  @httpMeta("GET", "")
  @httpController()
  public async getUsers(): Promise<HttpResponse> {
    const dbResponse = await this.db.scan("user");
    return new HttpResponse(200, dbResponse.data);
  }

  @httpMeta("POST", "")
  @httpController<UserCreate>(isCreateUserValidator)
  public async createUser(userToCreate: UserCreate): Promise<HttpResponse> {
    const id = randomUUID();
    const newUser = new User(
      id,
      userToCreate.username,
      userToCreate.age,
      userToCreate.hobbies
    );
    await this.db.hSet("user:" + id, newUser);
    return new HttpResponse(201, newUser);
  }

  @httpMeta("DELETE", "/{id:uuid}")
  @httpController()
  public deleteUser(params: { id: UUID }) {
    console.log(params);
  }

  @httpMeta("PUT", "/{id:uuid}")
  @httpController()
  public updateUsers() {}
}
