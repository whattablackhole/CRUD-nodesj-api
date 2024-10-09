import { IncomingMessage } from "node:http";
import { HttpError } from "../errors/base.js";
import { Handler, IHttpRouter, Route } from "./base.js";
import HttpResponse from "../http/response.js";

export class HttpRouter implements IHttpRouter {
  public readonly baseUrl: string;

  protected routes = new Map<
    string,
    Route[]
  >([
    ["GET", []],
    ["POST", []],
    ["DELETE", []],
    ["PUT", []],
  ]);

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.basePattern = new RegExp(`^(${baseUrl}\\/.*)|(${baseUrl})$`);
  }

  public get(path: string, handler: Handler): void {
    this.routes.get("GET").push({
      path: this.parseRegexFromPath(path),
      validator: this.parsePathValidator(path),
      handler,
    });
  }

  public post(path: string, handler: Handler): void {
    this.routes.get("POST").push({
      path: this.parseRegexFromPath(path),
      validator: this.parsePathValidator(path),
      handler,
    });
  }

  public put(path: string, handler: Handler): void {
    this.routes.get("DELETE").push({
      path: this.parseRegexFromPath(path),
      validator: this.parsePathValidator(path),
      handler,
    });
  }

  public delete(path: string, handler: Handler): void {
    this.routes.get("PUT").push({
      path: this.parseRegexFromPath(path),
      validator: this.parsePathValidator(path),
      handler,
    });
  }

  protected getRoute(method: string, path: string): Route {
    return this.routes.get(method).find((o) => o.path.test(path));
  }

  private getRegexByKeyWord(key: string) {
    const pair = key.split(":");

    if (pair[1] === "uuid") {
      return `(?<${pair[0]}>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`;
    }

    throw new Error();
  }

  protected parseRegexFromPath(path: string): RegExp {
    let regex = "^";

    let key = "";
    let keyParsing = false;

    for (const char of path) {
      if (char === "/") {
        regex += "\\/";
      } else if (char === "{") {
        keyParsing = true;
      } else if (char === "}" && keyParsing) {
        keyParsing = false;
        regex += this.getRegexByKeyWord(key);
        key = "";
      } else if (keyParsing) {
        key += char;
      } else {
        regex += char;
      }
    }
    regex += "$";
    return new RegExp(regex);
  }

  protected parsePathValidator(path: string): RegExp {
    let regex = "^";
    let placeholder = false;

    for (const char of path) {
      if (char === "{") {
        placeholder = true;
        regex += "([^\\/]+?)";
      } else if (char === "}") {
        placeholder = false;
      } else {
        regex += placeholder ? "" : char === "/" ? "\\/" : char;
      }
    }

    regex += "$";
    return new RegExp(regex);
  }

  private basePattern: RegExp;

  public match(path: string): boolean {
    return this.basePattern.test(path);
  }

  public async handle(req: IncomingMessage) {
    const strippedUrl = req.url.replace(this.baseUrl, "");

    const route = this.getRoute(req.method, strippedUrl);

    if (!route) {
      return new HttpResponse(404, `No resource for provided path: ${req.url}`);
    }

    const result = route.validator.exec(strippedUrl);

    if (result === null) {
      return new HttpResponse(400, `Invalid resource identifier: ${req.url}`);
    }

    return await route.handler(req, result.groups);
  }
  public register<T extends object>(controller: T) {
    const methodNames: (keyof T)[] = Object.getOwnPropertyNames(
      Object.getPrototypeOf(controller)
    ) as (keyof T)[];

    methodNames.forEach((m) => {
      const property = controller[m];

      if (typeof property !== "function") {
        return;
      }

      const httpInfo = Reflect.getOwnPropertyDescriptor(
        property,
        "httpInfo"
      ) as PropertyDescriptor | undefined;

      if (!httpInfo) {
        return;
      }

      const pathRegex = this.parseRegexFromPath(httpInfo.value.path);

      let route: Route = {
        validator: pathRegex,
        path: this.parsePathValidator(httpInfo.value.path),
        handler: property.bind(controller),
      };

      this.routes.get(httpInfo.value.method).push(route);
    });
  }
}
