import DbClient from "./database/client.js";
import { createServer } from "http";

export default class App {
  public serve(port = 4000, host = "localhost") {
    const server = createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });

      res.end("Hello, World!\n");
    });

    server.listen(port, host, () => {
      console.log(`Server is running at http://localhost:${port}/`);
    });
  }
}
