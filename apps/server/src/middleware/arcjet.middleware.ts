import aj from "../utils/arcjet";
import type { RequestHandler } from "express";
import { FORBIDDEN, TOO_MANY_REQUESTS } from "../constants/httpStatusCode";
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetProtection: RequestHandler = async (req, res, next) => {
	const details = {
		ip: req.ip || req.socket.remoteAddress || "",
		method: req.method,
		host: req.headers.host,
		path: req.path,
		headers: req.headers,
		query: req.query,
		body: req.body,
	};

	try {
		const decision = await aj.protect(details);

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				return res
					.status(TOO_MANY_REQUESTS)
					.json({ message: "⚠️ Rate limit exeeded - Too many requests!" });
			} else if (decision.reason.isBot()) {
				return res.status(FORBIDDEN).json({ message: "🤖 Bot detected - Access denied" });
			} else {
				return res.status(FORBIDDEN).json({ message: "❌ Access denied - Security policy" });
			}
		}
		// SpoofedBot - human like bots
		if (decision.results.some(isSpoofedBot)) {
			return res.status(FORBIDDEN).json({
				error: "🤖 Spoofed bot detected",
				message: "Bot activity detected",
			});
		}

		next();
	} catch (error) {
		next(error);
	}
};

export default arcjetProtection;
