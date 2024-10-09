import { IncomingMessage } from "http";
import { Validator } from "../validators/base.js";
import { ValidationError } from "../errors/base.js";

export  function httpMeta(method: string, path: string) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineProperty(descriptor.value, "httpInfo", {
      value: { path, method },
      writable: false,
      enumerable: true,
      configurable: true,
    });
  };
}

export function httpController<T>(validate?: Validator<T>) {
  async function parseBody(request: IncomingMessage) {
    console.log(request);
    return new Promise((resolve, reject) => {
      let body = "";

      request.on("data", (chunk) => {
        body += chunk.toString();
      });

      request.on("end", () => {
        try {
          const parsedBody = JSON.parse(body);
          validate(parsedBody);

          resolve(parsedBody);
        } catch (error) {
          if (error instanceof ValidationError) {
            reject(error);
          }
          // TODO: fix error processing
          reject(new ValidationError("Error parsing JSON body", 400));
        }
      });

      request.on("error", (error) => {
        reject(error);
      });
    });
  }
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (
      request: IncomingMessage,
      params?: { [key: string]: string }
    ) {
      const args: any[] = [];
      if (params) {
        args.push(params);
      }

      if (validate) {
        const body = await parseBody(request);
        args.push(body);
      }

      return await originalMethod.call(this, ...args);
    };
  };
}
