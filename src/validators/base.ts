import { ValidationError } from "../errors/base.js";
import { Schema } from "../schemas/user.schemas.js";

export type Validator<T> = (obj: any) => obj is T;

export function validate(obj: any, schema: Schema): boolean {
  const errors: Array<{ field: string; error: string }> = [];

  Object.keys(schema).forEach((key) => {
    const field = schema[key];

    if (!field.required && !Object.hasOwn(obj, key)) {
      return;
    }

    if (field.required && !Object.hasOwn(obj, key)) {
      errors.push({ field: key, error: "is not defined" });
      return;
    }

    const value = obj[key];

    if (field.type === "string" && typeof value !== "string") {
      errors.push({ field: key, error: "is not string" });
    } else if (field.type === "number" && typeof value !== "number") {
      errors.push({ field: key, error: "is not number" });
    } else if (field.type === "array") {
      if (!Array.isArray(value)) {
        errors.push({ field: key, error: "is not array" });
      } else if (
        field.arrayType &&
        !value.every((v: any) => typeof v === field.arrayType)
      ) {
        errors.push({
          field: key,
          error: `array should consist of ${field.arrayType}s`,
        });
      }
    }
  });

  const unknownFields = Object.keys(obj).filter((k) => !schema[k]);

  if (unknownFields.length > 0) {
    unknownFields.forEach((unknownField) => {
      errors.push({ field: unknownField, error: "unknown field" });
    });
  }

  if (errors.length === 0) {
    return true;
  }

  throw new ValidationError("Invalid request body.", 400, errors);
}
