function isCreateUser(obj: any): obj is UserCreate {
  const hasCorrectFields =
    typeof obj === "object" &&
    typeof obj.age === "number" &&
    Array.isArray(obj.hobbies) &&
    obj.hobbies.every((hobby: any) => typeof hobby === "string") &&
    typeof obj.username === "string";

  const hasOnlyExpectedFields =
    Object.keys(obj).length === 3 &&
    "hobbies" in obj &&
    "username" in obj &&
    "age" in obj;

  return hasCorrectFields && hasOnlyExpectedFields;
}
