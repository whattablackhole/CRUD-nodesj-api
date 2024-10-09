export interface UserCreate {
  hobbies: string[];
  age: number;
  username: string;
}

export interface UserUpdate {
  id?: string;
  hobbies: string[];
  age: number;
  username: string;
}

export interface SchemaField {
  type: "string" | "number" | "array";
  required: boolean;
  arrayType?: "string" | "number";
}

export type Schema = {
  [key: string]: SchemaField;
};

export const UserCreateSchema: Schema = {
  age: { type: "number", required: true },
  hobbies: { type: "array", required: true, arrayType: "string" },
  username: { type: "string", required: true },
};

export const UserUpdateSchema: Schema = {
  id: { type: "string", required: false },
  age: { type: "number", required: true },
  hobbies: { type: "array", required: true, arrayType: "string" },
  username: { type: "string", required: true },
};
