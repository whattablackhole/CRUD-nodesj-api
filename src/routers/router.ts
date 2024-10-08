import { Handler, IHttpRouter, Route } from "./base.js";

export abstract class HttpRouter implements IHttpRouter {
  public readonly baseUrl: string;

  protected routes = new Map<string, { path: RegExp; handler: Handler }[]>([
    ["GET", []],
    ["POST", []],
    ["DELETE", []],
    ["PUT", []],
  ]);

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public get(path: string, handler: Handler): void {
    this.routes.get("GET").push({
      path: this.parseRegexFromPath(path),
      handler,
    });
  }

  public post(path: string, handler: Handler): void {
    this.routes.get("POST").push({
      path: this.parseRegexFromPath(path),
      handler,
    });
  }

  public put(path: string, handler: Handler): void {
    this.routes.get("DELETE").push({
      path: this.parseRegexFromPath(path),
      handler,
    });
  }

  public delete(path: string, handler: Handler): void {
    this.routes.get("PUT").push({
      path: this.parseRegexFromPath(path),
      handler,
    });
  }

  protected getRoute(method: string, path: string): Route {
    return this.routes.get(method).find((o) => o.path.test(path));
  }

  private getRegexByKeyWord(key: string) {
    if (key === "uuid") {
      return "(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})";
    }
    throw new Error();
  }

  protected parseRegexFromPath(path: string): RegExp {
    let regex = "^";

    let key = "";
    let keyParsing = false;

    for (let char of path) {
      if (char === "/") {
        regex += "\\/";
        continue;
      }
      if (char === "{") {
        keyParsing = true;
        continue;
      }
      if (char === "}" && keyParsing) {
        keyParsing = false;
        regex += this.getRegexByKeyWord(key);
        key = "";
        continue;
      }
      if (keyParsing) {
        key += char;
      }
      regex += char;
    }
    regex += "$";
    return new RegExp(regex);
  }

  public abstract handle(...args: any): Promise<any>;

  public abstract match(path: string): boolean;
}
