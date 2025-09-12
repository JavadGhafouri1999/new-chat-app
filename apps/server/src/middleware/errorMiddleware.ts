import chalk from "chalk";
import type { ErrorRequestHandler, Request, Response } from "express";
import z, { ZodError } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatusCode";

const handleZodErrors = (res: Response, error: ZodError) => {
	const prettyZodError = z.prettifyError(error);
	return res.status(BAD_REQUEST).json({ message: prettyZodError });
};

const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
	// Log the path - method and error itself
	console.log(
		`\n-------------------------------\n${chalk.green("PATH:")} ${req.path} - ${chalk.blue("METHOD:")} ${
			req.method
		}\n${chalk.red("Error:")} ${error.message}\n-------------------------------\n`
	);

	if (error instanceof ZodError) {
		return handleZodErrors(res, error);
	}

	return res.status(INTERNAL_SERVER_ERROR).json({ message: "Something went wrong!" });
};

export default errorMiddleware;
