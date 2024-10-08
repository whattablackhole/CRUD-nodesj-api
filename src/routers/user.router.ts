import { IncomingMessage } from "node:http";
import { HttpRouter } from "./router.js";
import UserController from "../controllers/user.controller.js";
import { Route } from "./base.js";
import { HttpError } from "../errors/base.js";

export default class UserRouter extends HttpRouter {
  private basePattern: RegExp;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.basePattern = new RegExp(`^(${baseUrl}\\/.*)|(${baseUrl})$`);
  }

  public match(path: string): boolean {
    return this.basePattern.test(path);
  }

  public async handle(req: IncomingMessage) {
    const strippedUrl = req.url.replace(this.baseUrl, "");

    const route = this.getRoute(req.method, strippedUrl);

    if (!route) {
      // TODO: implement response type instead 
      throw new HttpError(
        `Bad Request! No resource for provided path: ${req.url}\n`,
        403
      );
    }

    return await route.handler(req);
  }

  public register(controller: UserController) {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(controller)
    );
    methodNames.forEach((m) => {
      const httpInfo = Reflect.getOwnPropertyDescriptor(
        controller[m as keyof UserController],
        "httpInfo"
      );

      if (!httpInfo) {
        return;
      }

      const pathRegex = this.parseRegexFromPath(httpInfo.value.path);

      let route: Route = {
        path: pathRegex,
        handler: controller[m as keyof UserController],
      };

      this.routes.get(httpInfo.value.method).push(route);
    });
  }
}
