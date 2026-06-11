import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(to: string, subject: string, content: string) {
	return resend.emails.send({
		from: process.env.SENDER_EMAIL!,
		to,
		subject: subject,
		html: content,
	});
}
