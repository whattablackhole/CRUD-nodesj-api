import {
  UserCreate,
  UserCreateSchema,
  UserUpdate,
  UserUpdateSchema,
} from "../schemas/user.schemas.js";

import { validate } from "./base.js";

export function isCreateUserValidator(obj: any): obj is UserCreate {
  return validate(obj, UserCreateSchema);
}

export function isUpdateUserValidator(obj: any): obj is UserUpdate {
  return validate(obj, UserUpdateSchema);
}
