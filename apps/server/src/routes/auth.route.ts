import { Router, type Router as ExpresRouter } from "express";
import {
	loginHandler,
	logoutHandler,
	refreshTokenHandler,
	registerHandler,
	updateUserProfile,
} from "../controllers/auth.controller";
import authProtect from "../middleware/auth.middleware";
import arcjetProtection from "../models/arcjet.middleware";

const authRouter: ExpresRouter = Router();

authRouter.use(arcjetProtection);

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/refresh", refreshTokenHandler);
authRouter.put("/update-profile", authProtect, updateUserProfile);

export default authRouter;
