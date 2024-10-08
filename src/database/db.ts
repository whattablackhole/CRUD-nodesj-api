import { createServer } from "node:net";

interface Request {
  method: "hSet";
  key: string;
  value: unknown;
}

interface Response {
  method: "hSet";
  status: "success" | "failure";
}

export default class DataBase {
  private storage = new Map();

  public serve(port = 4010, host = "localhost") {
    const server = createServer((socket) => {
      socket.on("data", (data) => {
        console.log("Received from client: " + data.toString());

        const request: Request = JSON.parse(data.toString());
        const response: Response = this.handleRequest(request);

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
  private handleRequest(request: Request): Response {
    switch (request.method) {
      case "hSet":
        return this.hSet(request.key, request.value);
      default:
        return {
          method: request.method,
          status: "failure",
        };
    }
  }
  private hSet(key: string, value: unknown): Response {
    if (this.storage.has(key)) {
      return {
        method: "hSet",
        status: "failure",
      };
    } else {
      this.storage.set(key, value);
      return {
        method: "hSet",
        status: "success",
      };
    }
  }
}
