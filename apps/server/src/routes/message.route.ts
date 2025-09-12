import { Router, type Router as ExpresRouter } from "express";

const messageRouter: ExpresRouter = Router();

messageRouter.post("/send", (req, res) => {
	res.send("OK");
});
// messageRouter.post("/login");
// messageRouter.get("/logout");
// messageRouter.get("/refresher");

export default messageRouter;
