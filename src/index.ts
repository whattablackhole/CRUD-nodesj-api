import App from "./app.js";
import UserController from "./controllers/user.controller.js";
import DbClient from "./database/client.js";
import DataBaseServer from "./database/server.js";
import { HttpRouter } from "./routers/router.js";
import dotenv from "dotenv";

dotenv.config();

const db = new DataBaseServer();

db.serve(Number.parseInt(process.env.DATABASE_SERVER_PORT));

const dbClient = new DbClient();

dbClient.connect(
  "localhost",
  Number.parseInt(process.env.DATABASE_SERVER_PORT)
);

const userRouter = new HttpRouter("/api/users");
userRouter.register<UserController>(new UserController(dbClient));
const app = new App();
app.registerRouter(userRouter);
app.serve(Number.parseInt(process.env.APP_SERVER_PORT));

export { app, db, dbClient };
