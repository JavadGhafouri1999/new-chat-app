import { Router, type Router as ExpresRouter } from "express";
import authProtect from "../middleware/auth.middleware";
import {
	getAllContactsHandler,
	getChatParnerHandler,
	getMessageByUSerIdHandler,
	sendMessageHandler,
} from "../controllers/message.controller";
import arcjetProtection from "../middleware/arcjet.middleware";

const messageRouter: ExpresRouter = Router();

// messageRouter.use(arcjetProtection, authProtect);
messageRouter.use(authProtect);

messageRouter.get("/chats", getChatParnerHandler);
messageRouter.get("/contacts", getAllContactsHandler);
messageRouter.get("/:id", getMessageByUSerIdHandler);
messageRouter.post("/send/:id", sendMessageHandler);

export default messageRouter;
