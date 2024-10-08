import { IncomingMessage } from "node:http";
import { HttpRouter } from "./router.js";
import UserController from "../controllers/user.controller.js";

export default class UserRouter extends HttpRouter {
  public match(path: string): boolean {
    return path.startsWith(this.baseUrl);
  }

  public async handle(request: IncomingMessage) {
    const strippedUrl = request.url.replace(this.baseUrl, "");
    const handler = this.getHandler(request.method, strippedUrl);
    return handler();
  }

  public register(controller: UserController) {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(controller)
    );
    methodNames.forEach((m) => {
      const result = Reflect.getOwnPropertyDescriptor(
        controller[m as keyof UserController],
        "httpInfo"
      );

      if (!result) {
        return;
      }
      const pathRegex = this.parseRegexFromPath(result.value.path);
      this.routes.get(result.value.method).push({
        path: pathRegex,
        handler: controller[m as keyof UserController],
      });
    });
  }
}
