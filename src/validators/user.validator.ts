import { ValidationError } from "../errors/base.js";
import { UserCreate } from "../schemas/user.schemas";

export function isCreateUserValidator(obj: any): obj is UserCreate {
  const errors = [];
  
  // TODO: Make generic
  
  if (!Object.hasOwn(obj, "age")) {
    errors.push({ field: "age", error: "is not defined" });
  } else if (typeof obj.age !== "number") {
    errors.push({ field: "age", error: "is not number" });
  }

  if (!Object.hasOwn(obj, "hobbies")) {
    errors.push({ field: "hobbies", error: "is not defined" });
  } else if (!Array.isArray(obj.hobbies)) {
    errors.push({ field: "hobbies", error: "is not array" });
  } else if (!obj.hobbies.every((hobby: any) => typeof hobby === "string")) {
    errors.push({ field: "hobbies", error: "array should consist of strings" });
  }

  if (!Object.hasOwn(obj, "username")) {
    errors.push({ field: "username", error: "is not defined" });
  } else if (typeof obj.username !== "string") {
    errors.push({ field: "username", error: "is not string" });
  }

  if (Object.keys(obj).length !== 3) {
    const unknownFields = Object.keys(obj)
      .filter((k) => !["username", "hobbies", "age"].includes(k))
      .map((k) => ({ field: k, error: "unknown field" }));

    errors.push(...unknownFields);
  }

  if (errors.length === 0) {
    return true;
  }

  throw new ValidationError("Invalid request body.", 403, errors);
}
