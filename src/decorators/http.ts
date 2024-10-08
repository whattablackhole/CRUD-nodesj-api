import { IncomingMessage } from "http";
import { Validator } from "../validators/base.js";
import { ValidationError } from "../errors/base.js";

export default function httpMeta(method: string, path: string) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    Reflect.defineProperty(originalMethod, "httpInfo", {
      value: { path, method },
      writable: false,
      enumerable: true,
      configurable: true,
    });

    descriptor.value = originalMethod;
  };
}


export function httpBody<T>(validator: Validator<T>) {
    return function (
      target: object,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
  
      descriptor.value = async function (request: IncomingMessage) {
        return new Promise((resolve, reject) => {
          let body = '';
  
          request.on('data', chunk => {
            body += chunk.toString();
          });
  
          request.on('end', () => {
            try {
              const parsedBody = JSON.parse(body);
              validator(parsedBody);
              
              const result = originalMethod.call(this, parsedBody);
              resolve(result);
            } catch (error) {
              if (error instanceof ValidationError) {
                reject(error);
              }
              reject(new ValidationError("Error parsing JSON body", 403));
            }
          });
  
          request.on('error', (error) => {
            reject(error);
          });
        });
      };
    };
  }