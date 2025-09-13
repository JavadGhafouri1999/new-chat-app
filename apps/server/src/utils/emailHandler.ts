import { createWelcomeEmailTemplate } from "./emailTemplates";
import { resend, sender } from "./resend";

export const sendWelcomeEmail = async (email: string, name: string, clientUrl: string) => {
	const { data, error } = await resend.emails.send({
		from: `${sender.name} <${sender.email}>`,
		to: email,
		subject: "به چتلی خوش آمدید",
		html: createWelcomeEmailTemplate(name, clientUrl),
	});
	if (error) {
		throw new Error(error.message);
	}
	console.log(data);
};
