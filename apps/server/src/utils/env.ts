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
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const EMAIL_FROM = getEnv("EMAIL_FROM");
export const EMAIL_FROM_NAME = getEnv("EMAIL_FROM_NAME");
export const ARCJET_KEY = getEnv("ARCJET_KEY");
export const ARCJET_ENV = getEnv("ARCJET_ENV");
export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
