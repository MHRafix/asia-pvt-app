import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { BlogPost } from '@/lib/models/BlogPost';
import { Package } from '@/lib/models/Package';
import { Service } from '@/lib/models/Service';
import { VisaCountry } from '@/lib/models/VisaCountry';
import { Appointment } from '@/lib/models/Appointment';
import { Contact } from '@/lib/models/Contact';

export async function GET() {
  try {
    await connectDB();

    const [
      totalPackages,
      totalServices,
      totalBlogs,
      totalVisaCountries,
      totalAppointments,
      pendingAppointments,
      totalContacts,
      newMessages,
      recentPackages,
      recentBlogs,
      recentAppointments,
      packagesByLocation,
      appointmentsByStatus,
    ] = await Promise.all([
      Package.countDocuments(),
      Service.countDocuments(),
      BlogPost.countDocuments(),
      VisaCountry.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Package.find().sort({ createdAt: -1 }).limit(5).select('title location price rating'),
      BlogPost.find().sort({ createdAt: -1 }).limit(5).select('title category author date'),
      Appointment.find().sort({ createdAt: -1 }).limit(5).select('name service date status'),
      Package.aggregate([
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    // Get monthly stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAppointments = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyContacts = await Contact.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyData = monthNames.map((name, index) => ({
      name,
      appointments: monthlyAppointments.find((m) => m._id === index + 1)?.count || 0,
      contacts: monthlyContacts.find((m) => m._id === index + 1)?.count || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalPackages,
          totalServices,
          totalBlogs,
          totalVisaCountries,
          totalAppointments,
          pendingAppointments,
          totalContacts,
          newMessages,
        },
        recentPackages,
        recentBlogs,
        recentAppointments,
        packagesByLocation: packagesByLocation.map((p) => ({
          name: p._id || 'Unknown',
          value: p.count,
        })),
        appointmentsByStatus: appointmentsByStatus.map((a) => ({
          name: a._id || 'Unknown',
          value: a.count,
        })),
        monthlyData,
      },
    });
  } catch (error) {
    console.error('[v0] Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
