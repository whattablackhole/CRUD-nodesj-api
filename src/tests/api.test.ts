import HttpResponse from "../http/response";
import { UserCreate } from "../schemas/user.schemas";
import { app, db } from "../index";
import http, { IncomingMessage } from "http";

describe("Api tests", () => {
  afterAll(async () => {
    await app.stop();
    await db.stop();
  });

  describe("Scenario 1: basic functionality", () => {
    let createdUserId = "";

    it("should receive empty array of users", async () => {
      const result = await makeRequest("GET", "/api/users");
      expect(result.response.statusCode).toBe(200);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        data: [],
        message: "Ok",
        statusCode: 200,
      });
    });

    it("should create new user", async () => {
      const userToCreate: UserCreate = {
        age: 10,
        hobbies: ["football", "programming", "reading"],
        username: "Jabby",
      };

      const result = await makeRequest(
        "POST",
        "/api/users",
        JSON.stringify(userToCreate)
      );
      expect(result.response.statusCode).toBe(201);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        data: { id: expect.any(String), ...userToCreate },
        message: "Ok",
        statusCode: 201,
      });
      createdUserId = result.body.data.id;
    });

    it("should retrieve new user by id", async () => {
      const expectedUser = {
        id: createdUserId,
        age: 10,
        hobbies: ["football", "programming", "reading"],
        username: "Jabby",
      };

      const result = await makeRequest("GET", `/api/users/${createdUserId}`);

      expect(result.response.statusCode).toBe(200);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        data: expectedUser,
        message: "Ok",
        statusCode: 200,
      });
    });

    it("should delete user by id", async () => {
      const result = await makeRequest("DELETE", `/api/users/${createdUserId}`);

      expect(result.response.statusCode).toBe(204);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toBeNull();
    });

    it("should retrieve correct response when asking for deleted user", async () => {
      const result = await makeRequest("GET", `/api/users/${createdUserId}`);

      expect(result.response.statusCode).toBe(404);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        message: "User not found.",
        statusCode: 404,
      });
    });
  });

  describe("Scenario 2: updating, listing functionality", () => {
    let userWithoutHobbies = {
      age: 10,
      hobbies: [] as string[],
      username: "Jabby",
    } as any;

    let userWithHobbies = {
      age: 18,
      hobbies: ["Hokey"],
      username: "Mike",
    } as any;

    it("should receive empty array of users", async () => {
      const result = await makeRequest("GET", "/api/users");
      expect(result.response.statusCode).toBe(200);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        data: [],
        message: "Ok",
        statusCode: 200,
      });
    });

    it("should create new user with empty list of hobbies", async () => {
      const result = await makeRequest(
        "POST",
        "/api/users",
        JSON.stringify(userWithoutHobbies)
      );
      expect(result.response.statusCode).toBe(201);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        data: { ...userWithoutHobbies, id: expect.any(String) },
        message: "Ok",
        statusCode: 201,
      });
      userWithoutHobbies.id = result.body.data.id;
    });

    it("should create another new user with list of hobbies", async () => {
      const result = await makeRequest(
        "POST",
        "/api/users",
        JSON.stringify(userWithHobbies)
      );

      expect(result.response.statusCode).toBe(201);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        data: { ...userWithHobbies, id: expect.any(String) },
        message: "Ok",
        statusCode: 201,
      });
      userWithHobbies.id = result.body.data.id;
    });

    it("should retrieve list of 2 created users", async () => {
      const result = await makeRequest("GET", `/api/users`);

      expect(result.response.statusCode).toBe(200);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        data: expect.arrayContaining([userWithHobbies, userWithoutHobbies]),
        message: "Ok",
        statusCode: 200,
      });
    });

    it("should receive user with updated fields", async () => {
      userWithoutHobbies.hobbies.push(...["programming", "dancing", "drawing"]);

      const result = await makeRequest(
        "PUT",
        `/api/users/${userWithoutHobbies.id}`,
        JSON.stringify(userWithoutHobbies)
      );

      expect(result.response.statusCode).toBe(200);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        data: userWithoutHobbies,
        message: "Ok",
        statusCode: 200,
      });
    });
  });

  describe("Scenario 3: validation", () => {
    it("should receive validation errors when creating user with invalid data", async () => {
      const expectedValidationErrors = [
        {
          error: "is not number",
          field: "age",
        },
        {
          error: "array should consist of strings",
          field: "hobbies",
        },
        {
          error: "is not defined",
          field: "username",
        },
        {
          error: "unknown field",
          field: "admin",
        },
      ];
      const invalidUser = {
        admin: true,
        age: "5",
        hobbies: [123],
      };
      const result = await makeRequest(
        "POST",
        "/api/users",
        JSON.stringify(invalidUser)
      );
      expect(result.response.statusCode).toBe(400);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        validationErrors: expectedValidationErrors,
        message: "Invalid request body.",
        statusCode: 400,
      });
    });

    it("should receive uknown resource error response when used wrong url", async () => {
      const result = await makeRequest(
        "GET",
        "/api/users/articles/1",
      );
      expect(result.response.statusCode).toBe(404);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        message: "No resource for provided path: /api/users/articles/1, method: GET",
        statusCode: 404,
      });
    });

    it("should receive uknown resource error response when used wrong method", async () => {
      const result = await makeRequest(
        "PATCH",
        "/api/users",
      );
      expect(result.response.statusCode).toBe(404);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        message: "No resource for provided path: /api/users, method: PATCH",
        statusCode: 404,
      });
    });

    it("should receive invalid identifier error response", async () => {
      const result = await makeRequest(
        "GET",
        "/api/users/articles",
      );
      expect(result.response.statusCode).toBe(400);
      expect(result.response.headers["content-type"]).toContain(
        "application/json"
      );
      expect(result.body).toEqual({
        message: "Invalid resource identifier: /articles",
        statusCode: 400,
      });
    });
  });
});

const makeRequest = async (method: string, pathname: string, body?: string) => {
  return new Promise<{ body: HttpResponse; response: IncomingMessage }>(
    (resolve, rej) => {
      const options = {
        method,
        hostname: "localhost",
        port: Number.parseInt(process.env.APP_SERVER_PORT),
        path: pathname,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const req = http.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve({ body: data ? JSON.parse(data) : null, response: res });
        });
      });

      req.on("error", (error) => {
        rej(error);
      });

      if (body) {
        req.write(body);
      }

      req.end();
    }
  );
};
