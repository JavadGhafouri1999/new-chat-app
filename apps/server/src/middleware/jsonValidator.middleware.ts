import type { RequestHandler } from "express";
import { PAYLOAD_TOO_LARGE } from "../constants/httpStatusCode";

/**
 * The middleware specifically validates the depth and number of keys in JSON objects to prevent deeply nested or overly large JSON payloads.
 *
 * This will apply the JSON validation middleware to all routes that come after it. The middleware will check all incoming JSON payloads for excessive nesting depth (more than 5 levels) or too many keys (more than 500 keys in an object), and return an error if these limits are exceeded.
 */
const jsonValidator: RequestHandler = (req, res, next) => {
	const maxDepth = 5;
	const maxKeys = 500;

	try {
		const validateDepth = (obj: any, depth = 0) => {
			if (depth > maxDepth) {
				throw new Error("Object depth exceeds maximum allowed");
			}

			if (typeof obj === "object" && obj !== null) {
				const keys = Object.keys(obj);
				if (keys.length > maxKeys) {
					throw new Error("Object keys exceed maximum allowed");
				}

				keys.forEach((key) => {
					validateDepth(obj[key], depth + 1);
				});
			}
		};

		if (req.body) {
			validateDepth(req.body);
		}
		next();
	} catch (error: any) {
		res.status(PAYLOAD_TOO_LARGE).json({
			error: "Payload validation failed",
			message: error.message,
			timestamp: new Date().toISOString(),
		});
	}
};

export default jsonValidator;
