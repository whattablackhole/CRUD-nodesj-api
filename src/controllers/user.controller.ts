import httpMeta from "../decorators/http.js";

export default class UserController {
  @httpMeta("POST", "")
  public createUser() {
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
