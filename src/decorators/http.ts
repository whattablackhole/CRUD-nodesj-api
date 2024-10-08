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
