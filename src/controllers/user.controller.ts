import httpMeta, { httpBody } from "../decorators/http.js";
import { UserCreate } from "../schemas/user.schemas.js";
import { isCreateUserValidator } from "../validators/user.validator.js";

export default class UserController {

  @httpMeta("POST", "")
  @httpBody<UserCreate>(isCreateUserValidator)
  public createUser(user: UserCreate) {
    console.log(user);
    return "Ok";
  }

  @httpMeta("DELETE", "/{uuid}")
  public deleteUser() {}

  @httpMeta("GET", "/{uuid}")
  public getUser() {}

  @httpMeta("GET", "")
  public getUsers() {}

  @httpMeta("PUT", "/{uuid}")
  public updateUsers() {}
}
