import { Router, type Router as ExpresRouter } from "express";
import { loginHandler, logoutHandler, refreshTokenHandler, registerHandler } from "../controllers/auth.controller";

const authRouter: ExpresRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/refresh", refreshTokenHandler);

export default authRouter;
