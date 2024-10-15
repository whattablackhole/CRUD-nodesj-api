import { Socket } from "node:net";
import { EventEmitter } from "node:events";
import { randomUUID } from "node:crypto";
import { DBRequest, DBResponse } from "./base.js";

export default class DbClient {
  private connection: Socket;
  private responseEmitter: EventEmitter = new EventEmitter();

  public disconnect() {
    this.connection.destroy();
  }

  public async connect(host: string, port: number) {
    return new Promise<void>((resolve, reject) => {
      const client = new Socket();
      this.connection = client.connect(port, host);

      const onConnectionError = (err: Error) => {
        console.error("Connection error:", err);
        reject(err);
      };

      this.connection.once("error", onConnectionError);

      this.connection.once("connect", () => {
        console.log("Connected to db server");
        this.connection.removeListener("error", onConnectionError);
        resolve();
      });

      this.connection.on("data", (streamData) => {
        const response = JSON.parse(streamData.toString());
        this.responseEmitter.emit(response.id, response);
      });

      this.connection.on("error", (err) => {
        console.error("DB client error:", err);
        throw err;
      });
    });
  }

  public async hSet(key: string, value: unknown) {
    return await new Promise((resolve, reject) => {
      const requestID = randomUUID();

      const timeout = setTimeout(() => {
        reject(`request ${requestID} timeout.`);
        this.responseEmitter.removeAllListeners(request.id);
      }, 3000);

      const request: DBRequest = { method: "hSet", key, value, id: requestID };
      this.connection.write(JSON.stringify(request), (err) => {
        if (err) {
          reject(err);
        }
      });
      this.responseEmitter.once(requestID, (response: DBResponse) => {
        clearTimeout(timeout);
        resolve(response);
      });
    });
  }

  public async hGet(key: string): Promise<DBResponse> {
    return await new Promise((resolve, reject) => {
      const requestID = randomUUID();

      const timeout = setTimeout(() => {
        reject(`request ${requestID} timeout.`);
        this.responseEmitter.removeAllListeners(request.id);
      }, 3000);

      const request: DBRequest = { method: "hGet", key, id: requestID };
      this.connection.write(JSON.stringify(request), (err) => {
        if (err) {
          reject(err);
        }
      });
      this.responseEmitter.once(requestID, (response: DBResponse) => {
        clearTimeout(timeout);
        resolve(response);
      });
    });
  }

  public async scan(key: string): Promise<DBResponse> {
    return await new Promise((resolve, reject) => {
      const requestID = randomUUID();

      const timeout = setTimeout(() => {
        reject(`request ${requestID} timeout.`);
        this.responseEmitter.removeAllListeners(request.id);
      }, 3000);

      const request: DBRequest = { method: "scan", key, id: requestID };
      this.connection.write(JSON.stringify(request), (err) => {
        if (err) {
          reject(err);
        }
      });
      this.responseEmitter.once(requestID, (response: DBResponse) => {
        clearTimeout(timeout);
        resolve(response);
      });
    });
  }

  public async delete(key: string): Promise<DBResponse> {
    return await new Promise((resolve, reject) => {
      const requestID = randomUUID();

      const timeout = setTimeout(() => {
        reject(`request ${requestID} timeout.`);
        this.responseEmitter.removeAllListeners(request.id);
      }, 3000);

      const request: DBRequest = { method: "delete", key, id: requestID };
      this.connection.write(JSON.stringify(request), (err) => {
        if (err) {
          reject(err);
        }
      });
      this.responseEmitter.once(requestID, (response: DBResponse) => {
        clearTimeout(timeout);
        resolve(response);
      });
    });
  }

  public async update(key: string, value: unknown): Promise<DBResponse> {
    return await new Promise((resolve, reject) => {
      const requestID = randomUUID();

      const timeout = setTimeout(() => {
        reject(`request ${requestID} timeout.`);
        this.responseEmitter.removeAllListeners(request.id);
      }, 3000);

      const request: DBRequest = {
        method: "update",
        key,
        value,
        id: requestID,
      };
      this.connection.write(JSON.stringify(request), (err) => {
        if (err) {
          reject(err);
        }
      });
      this.responseEmitter.once(requestID, (response: DBResponse) => {
        clearTimeout(timeout);
        resolve(response);
      });
    });
  }
}
