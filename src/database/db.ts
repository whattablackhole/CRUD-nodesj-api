import { createServer } from "node:net";

export default class DataBase {
  private storage = new Map();

  public serve(port = 4010, host = "localhost") {
    const server = createServer((socket) => {
      console.log("Client connected");

      socket.on("data", (data) => {
        console.log("Received from client: " + data.toString());
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
}
