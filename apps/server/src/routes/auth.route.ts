import { Router, type Router as ExpresRouter } from "express";
import {
	loginHandler,
	logoutHandler,
	refreshTokenHandler,
	registerHandler,
	updateUserProfile,
} from "../controllers/auth.controller";
import authProtect from "../middleware/auth.middleware";

const authRouter: ExpresRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/refresh", refreshTokenHandler);
authRouter.put("/update-profile", authProtect, updateUserProfile);

export default authRouter;
