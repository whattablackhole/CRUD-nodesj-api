import { UUID } from "node:crypto";
import { createServer } from "node:net";
import { DBRequest, DBResponse } from "./base.js";

export default class DataBaseServer {
  private storage = new Map();

  public serve(port = 4010, host = "localhost") {
    const server = createServer((socket) => {
      socket.on("data", (data) => {
        console.log("Received from client: " + data.toString());

        const request: DBRequest = JSON.parse(data.toString());
        const response: DBResponse = this.handleRequest(request);

        socket.write(JSON.stringify(response));
      });

      socket.on("end", () => {
        console.log("Client disconnected");
      });

      socket.on("error", (err) => {
        console.error("Socket error:", err);
      });
    });

    server.listen(port, host, () => {
      console.log(`Database server listening on port ${port}`);
    });
  }
  private handleRequest(request: DBRequest): DBResponse {
    switch (request.method) {
      case "hSet":
        return this.hSet(request.key, request.value, request.id);
      case "hGet":
        return this.hGet(request.key, request.id);
      case "scan":
        return this.scan(request.key, request.id);
      default:
        return {
          method: request.method,
          id: request.id,
          status: "failure",
          data: null,
        };
    }
  }
  private scan(key: string, id: UUID): DBResponse {
    const result: unknown[] = [];

    this.storage.forEach((v, k) => {
      const group = k.split(":")[0];
      if (group === key) {
        result.push(v);
      }
    });

    return {
      data: result,
      id: id,
      method: "scan",
      status: "success",
    };
  }

  private hSet(key: string, value: unknown, id: UUID): DBResponse {
    if (this.storage.has(key)) {
      return {
        method: "hSet",
        status: "failure",
        id,
        data: null,
      };
    } else {
      this.storage.set(key, value);
      return {
        method: "hSet",
        status: "success",
        id,
        data: null,
      };
    }
  }

  private hGet(key: string, id: UUID): DBResponse {
    if (!this.storage.has(key)) {
      return {
        method: "hGet",
        status: "failure",
        id,
        data: null,
      };
    } else {
      const object = this.storage.get(key);
      return {
        method: "hGet",
        status: "success",
        id,
        data: object,
      };
    }
  }
}
