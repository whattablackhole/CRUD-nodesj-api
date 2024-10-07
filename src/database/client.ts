import { Socket } from "node:net";

export default class DbClient {
  private connection: Socket;

  public connect(host: string, port: number) {
    const client = new Socket();

    client.connect(port, host, () => {
      console.log("Connected to server");
      this.connection = client;
    });

    client.on("data", (data: any) => {
      console.log("Received from server: " + data.toString());
    });

    client.on("close", () => {
      this.connection = null;
      console.log("Connection closed");
    });

    client.on("error", (err: any) => {
      this.connection = null;
      console.error("Client error:", err);
    });
  }

  public hSet(key: string, value: unknown) {
    // parse
  }

  public hGet(key: string) {
    // user:id
  }

  public scan(key: string) {
    // user:*
  }

  constructor() {}
}
