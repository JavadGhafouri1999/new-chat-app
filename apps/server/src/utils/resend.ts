import { Resend } from "resend";
import { EMAIL_FROM, EMAIL_FROM_NAME, RESEND_API_KEY } from "./env";

export const resend = new Resend(RESEND_API_KEY);

export const sender = {
	email: EMAIL_FROM,
	name: EMAIL_FROM_NAME,
};
