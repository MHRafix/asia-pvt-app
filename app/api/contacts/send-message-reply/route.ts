import { connectDB } from '@/lib/db/connection';
import { sendMail } from '@/lib/mail-service/mail';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		await connectDB();
		const body = await request.json();

		if (!body.email || !body.replyText) {
			return NextResponse.json(
				{ success: false, message: 'Missing required fields' },
				{ status: 400 },
			);
		}

		await sendMail(
			body?.email,
			'Reply from team "Asia Tours"',
			`<p>${body?.replyText}</p>`,
		);
		return NextResponse.json(
			{ success: true, message: 'Reply has been sent.' },
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error creating contact:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to create contact' },
			{ status: 500 },
		);
	}
}
