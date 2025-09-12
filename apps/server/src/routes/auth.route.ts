import { Router, type Router as ExpresRouter } from "express";

const authRouter: ExpresRouter = Router();

authRouter.post("/register", (req, res) => {
	res.send("OK");
});
// authRouter.post("/login");
// authRouter.get("/logout");
// authRouter.get("/refresher");

export default authRouter;
