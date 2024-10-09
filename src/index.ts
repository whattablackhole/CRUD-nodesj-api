import App from "./app.js";
import UserController from "./controllers/user.controller.js";
import DbClient from "./database/client.js";
import DataBaseServer from "./database/server.js";
import { HttpRouter } from "./routers/router.js";

const db = new DataBaseServer();
db.serve();
const dbClient = new DbClient();
await dbClient.connect("localhost", 4010);
const userRouter = new HttpRouter("/api/users");
userRouter.register<UserController>(new UserController(dbClient));
const app = new App();
app.registerRouter(userRouter);
app.serve();
