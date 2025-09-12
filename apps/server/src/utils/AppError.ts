import type AppErrorCode from "../constants/errorCode";
import type { HttpStatusCode } from "../constants/httpStatusCode";

class AppError extends Error {
	constructor(
		public statusCode: HttpStatusCode,
		public message: string,
		public errorCode?: AppErrorCode
	) {
		super(message);
	}
}

export default AppError;
