function getEnv(key: string, defaultValue?: string): string {
	const value = process.env[key] || defaultValue;

	if (!value || value === undefined) {
		throw new Error(`${key} dose not exist in env file`);
	}

	return value;
}

export const PORT = getEnv("PORT", "5001");
export const NODE_ENV = getEnv("NODE_ENV");
export const MONGO_URI = getEnv("MONGO_URI");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");
