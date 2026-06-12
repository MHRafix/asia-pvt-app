import { connectDB } from '@/lib/db/connection';
import { sendMail } from '@/lib/mail-service/mail';
import { Appointment } from '@/lib/models/Appointment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	try {
		await connectDB();
		const appointments = await Appointment.find().sort({ createdAt: -1 });
		return NextResponse.json({ success: true, data: appointments });
	} catch (error) {
		console.error('[v0] Error fetching appointments:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch appointments' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();
		const body = await request.json();

		if (!body.fullName || !body.email || !body.phone || !body.service) {
			return NextResponse.json(
				{ success: false, message: 'Missing required fields' },
				{ status: 400 },
			);
		}

		const newAppointment = await Appointment.create(body);
		await sendMail(
			body?.email,
			'Your appointment booking has been success',
			`<div>

  <div>
 

<h1 style="
  margin:0;
  font-size:30px;
  color:#111827;
  font-weight:700;
">
  Appointment Booked
</h1>

<p style="
  margin:15px 0 0;
  color:#6b7280;
  font-size:16px;
  line-height:1.8;
">
  Hey <strong>${body.fullName}</strong>,
  <br><br>
  Thank you for choosing our service. Your appointment has been successfully booked. Currently your appointment is <strong style="color: red;">pending</strong>, we'll confirm you as soon as possible.
</p>

<p style="color: blue;">Thank You</p>
<strong style="color: #ccc;">Team Asia Tours</strong>

  </div>

</div>
`,
		);
		return NextResponse.json(
			{ success: true, data: newAppointment },
			{ status: 201 },
		);
	} catch (error) {
		console.error('[v0] Error creating appointment:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to create appointment' },
			{ status: 500 },
		);
	}
}
// <div style="text-align:center;">
//   <a href="{{TRACK_URL}}" style="
//     display:inline-block;
//     background:#2563eb;
//     color:#ffffff;
//     text-decoration:none;
//     padding:14px 32px;
//     border-radius:8px;
//     font-size:15px;
//     font-weight:600;
//   ">
//     View Appointment
//   </a>
// </div>
// `<div style="padding:40px 30px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">

//   <div style="text-align:center;margin-bottom:30px;">
//     <div style="
//       width:80px;
//       height:80px;
//       line-height:80px;
//       margin:0 auto 20px;
//       background:#ecfdf5;
//       border-radius:50%;
//       font-size:36px;
//       color:#16a34a;
//       font-weight:bold;
//     ">
//       ✓
//     </div>

// <h1 style="
//   margin:0;
//   font-size:30px;
//   color:#111827;
//   font-weight:700;
// ">
//   Appointment Booked
// </h1>

// <p style="
//   margin:15px 0 0;
//   color:#6b7280;
//   font-size:16px;
//   line-height:1.8;
// ">
//   Hey <strong>${body.fullName}</strong>,
//   <br><br>
//   Thank you for choosing our service. Your appointment has been successfully booked. Currently your appointment is <strong style="color: red;">pending</strong>, we'll confirm you as soon as possible.
// </p>

//   </div>

//   <div style="
//     background:#f8fafc;
//     border:1px solid #e5e7eb;
//     border-radius:12px;
//     padding:25px;
//     margin:30px 0;
//   ">

// <h3 style="
//   margin:0 0 20px;
//   color:#111827;
//   font-size:18px;
// ">
//   Appointment Details
// </h3>

// <table width="100%" cellpadding="0" cellspacing="0">
//   <tr>
//     <td style="padding:10px 0;color:#6b7280;">
//       Service
//     </td>
//     <td style="padding:10px 0;color:#111827;font-weight:600;text-align:right;">
//       ${body.service}
//     </td>
//   </tr>

//   <tr>
//     <td style="padding:10px 0;color:#6b7280;">
//       Date
//     </td>
//     <td style="padding:10px 0;color:#111827;font-weight:600;text-align:right;">
//     ${body?.preferredDate}
//     </td>
//     </tr>

//     <tr>
//     <td style="padding:10px 0;color:#6b7280;">
//     Time
//     </td>
//     <td style="padding:10px 0;color:#111827;font-weight:600;text-align:right;">
//     ${body?.preferredTime}
//     </td>
//   </tr>

//   <tr>
//     <td style="padding:10px 0;color:#6b7280;">
//       Booking ID
//     </td>
//     <td style="padding:10px 0;color:#111827;font-weight:600;text-align:right;">
//       #${newAppointment?._id.toString().slice(15, 20)}
//     </td>
//   </tr>
// </table>

//   </div>

//   <div style="
//     background:#eff6ff;
//     border-left:4px solid #2563eb;
//     padding:20px;
//     border-radius:8px;
//     margin-bottom:30px;
//   ">
//     <p style="
//       margin:0;
//       color:#1e40af;
//       font-size:14px;
//       line-height:1.8;
//     ">
//       Please arrive at least <strong>10 minutes before</strong> your scheduled appointment time.
//       If you need to make any changes, kindly contact our support team beforehand.
//     </p>
//   </div>

//   <p style="
//     margin-top:35px;
//     color:#6b7280;
//     font-size:15px;
//     line-height:1.8;
//     text-align:center;
//   ">
//     We look forward to serving you and making your experience exceptional.
//   </p>

// </div>
// `
