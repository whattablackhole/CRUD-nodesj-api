import App from "./app.js";
import UserController from "./controllers/user.controller.js";
import DataBase from "./database/db.js";
import UserRouter from "./routers/user.router.js";

const app = new App();
const db = new DataBase();

const userRouter = new UserRouter("/api/users");
userRouter.register(new UserController());
app.registerRouter(userRouter);

db.serve();
app.serve();
