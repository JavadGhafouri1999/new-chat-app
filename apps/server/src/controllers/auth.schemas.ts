import z from "zod";

export const emailSchema = z.email();
export const passwordSchema = z
	.string()
	.min(6, "Password must be at least 6 chars")
	.max(24, "You don't need more than 24 chars");
export const usernameSchema = z
	.string()
	.min(3, "username must be at lease 3 chars")
	.max(16, "username can't be longer thab 16 chars")
	.regex(
		/^[a-zA-Z][a-zA-Z0-9]*$/,
		"Username must start with a letter and contain only English letters and numbers"
	);

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	userAgent: z.string().optional(),
});

export const updateSchema = z.object({
	username: usernameSchema.optional(),
	password: passwordSchema.optional(),
	profileImage: z.string().optional(),
});
export type UpdateUser = z.infer<typeof updateSchema>;

export const registerSchema = loginSchema
	.extend({
		username: usernameSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})
	.strict();

export const verificationSchema = z.string().min(1).max(24);

export const resetPasswordSchema = z.object({
	verificationCode: z.string().min(1).max(24),
	newPassword: passwordSchema,
});
