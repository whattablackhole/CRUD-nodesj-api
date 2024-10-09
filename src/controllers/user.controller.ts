import { randomUUID, UUID } from "crypto";
import { httpMeta, httpController } from "../decorators/http.js";
import { UserCreate, UserUpdate } from "../schemas/user.schemas.js";
import { User } from "../models/user.model.js";
import DbClient from "../database/client.js";
import HttpResponse from "../http/response.js";
import {
  isCreateUserValidator,
  isUpdateUserValidator,
} from "../validators/user.validator.js";

export default class UserController {
  private db: DbClient;

  constructor(db: DbClient) {
    this.db = db;
  }

  @httpMeta("GET", "/{id:uuid}")
  @httpController()
  public async getUser({ id }: { id: UUID }) {
    const dbResponse = await this.db.hGet(`user:${id}`);

    if (dbResponse.status === "success") {
      return new HttpResponse(200, "Ok", dbResponse.data);
    } else {
      return new HttpResponse(404, "User not found.");
    }
  }

  @httpMeta("GET", "")
  @httpController()
  public async getUsers(): Promise<HttpResponse> {
    const dbResponse = await this.db.scan("user");
    return new HttpResponse(200, "Ok", dbResponse.data);
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
    return new HttpResponse(201, "Ok", newUser);
  }

  @httpMeta("DELETE", "/{id:uuid}")
  @httpController()
  public async deleteUser({ id }: { id: UUID }) {
    const response = await this.db.delete("user:" + id);

    if (response.status === "success") {
      return new HttpResponse(204, "User successfuly deleted.");
    } else {
      return new HttpResponse(404, "User not found.");
    }
  }

  @httpMeta("PUT", "/{id:uuid}")
  @httpController<UserUpdate>(isUpdateUserValidator)
  public async updateUsers({ id }: { id: UUID }, userToUpdate: UserUpdate) {
    const updatedUser = new User(
      id,
      userToUpdate.username,
      userToUpdate.age,
      userToUpdate.hobbies
    );
    const response = await this.db.update("user:" + id, updatedUser);
    if (response.status === "success") {
      return new HttpResponse(200, "Ok", response.data);
    } else {
      return new HttpResponse(404, "User not found.");
    }
  }
}
