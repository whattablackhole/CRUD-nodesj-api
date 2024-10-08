import { Socket } from "node:net";

export default class DbClient {
  private connection: Socket;

  public async connect(host: string, port: number) {
    return new Promise<void>((resolve, reject) => {
      const client = new Socket();
      this.connection = client.connect(port, host);

      this.connection.once("error", (err) => {
        console.error("Connection error:", err);
        reject(err);
      });

      this.connection.once("connect", () => {
        console.log("Connected to server");
        this.connection.removeAllListeners();
        resolve();
      });
    });
  }

  public async hSet(key: string, value: unknown) {
    return await new Promise((resolve, reject) => {
      this.connection.write(
        JSON.stringify({ method: "hSet", key, value }),
        (err) => {
          if (err) {
            reject(err);
          }
        }
      );
      this.connection.once("data", (data) => {
        resolve(data);
      });
    });
  }

  public hGet(key: string) {
    // user:id
  }

  public scan(key: string) {
    // user:*
  }

  constructor() {}
}
