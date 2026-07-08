import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Client } from '@/lib/models/Client';
import { DailyService } from '@/lib/models/DailyService';
import { ClientTransaction } from '@/lib/models/ClientTransaction';
import { Invoice } from '@/lib/models/Invoice';

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const period = searchParams.get('period') || 'all'; // 'all', 'today', 'week', 'month'

		// Calculate date range
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);

		let dateFilter: any = {};
		if (period === 'today') {
			dateFilter = { $gte: today };
		} else if (period === 'week') {
			dateFilter = { $gte: oneWeekAgo };
		} else if (period === 'month') {
			dateFilter = { $gte: oneMonthAgo };
		}

		// Get client stats
		const clientStats = await Client.aggregate([
			{
				$group: {
					_id: null,
					totalClients: { $sum: 1 },
					activeClients: {
						$sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
					},
					vipClients: {
						$sum: { $cond: [{ $eq: ['$status', 'vip'] }, 1, 0] },
					},
					prospectClients: {
						$sum: { $cond: [{ $eq: ['$status', 'prospect'] }, 1, 0] },
					},
				},
			},
		]);

		// Get new clients in period
		const newClientsQuery: any = {};
		if (Object.keys(dateFilter).length > 0) {
			newClientsQuery.createdAt = dateFilter;
		}
		const newClientsCount = await Client.countDocuments(newClientsQuery);

		// Get service stats
		const serviceStatsQuery: any = {};
		if (Object.keys(dateFilter).length > 0) {
			serviceStatsQuery.createdDate = dateFilter;
		}
		const serviceStats = await DailyService.aggregate([
			{
				$match: serviceStatsQuery,
			},
			{
				$group: {
					_id: null,
					totalServices: { $sum: 1 },
					completedServices: {
						$sum: {
							$cond: [
								{ $eq: ['$serviceStatus', 'completed'] },
								1,
								0,
							],
						},
					},
					pendingServices: {
						$sum: {
							$cond: [
								{ $eq: ['$serviceStatus', 'pending'] },
								1,
								0,
							],
						},
					},
					inProgressServices: {
						$sum: {
							$cond: [
								{
									$eq: ['$serviceStatus', 'in_progress'],
								},
								1,
								0,
							],
						},
					},
					totalCost: { $sum: '$serviceCost' },
				},
			},
		]);

		// Get transaction stats
		const transactionStatsQuery: any = {};
		if (Object.keys(dateFilter).length > 0) {
			transactionStatsQuery.createdAt = dateFilter;
		}
		const transactionStats = await ClientTransaction.aggregate([
			{
				$match: transactionStatsQuery,
			},
			{
				$group: {
					_id: null,
					totalTransactions: { $sum: 1 },
					totalAmount: { $sum: '$amount' },
					completedTransactions: {
						$sum: {
							$cond: [
								{ $eq: ['$status', 'completed'] },
								1,
								0,
							],
						},
					},
					pendingAmount: {
						$sum: {
							$cond: [
								{ $eq: ['$status', 'pending'] },
								'$amount',
								0,
							],
						},
					},
				},
			},
		]);

		// Get invoice stats
		const invoiceStatsQuery: any = {};
		if (Object.keys(dateFilter).length > 0) {
			invoiceStatsQuery.paymentDate = dateFilter;
		}
		const invoiceStats = await Invoice.aggregate([
			{
				$match: invoiceStatsQuery,
			},
			{
				$group: {
					_id: null,
					totalInvoices: { $sum: 1 },
					totalAmount: { $sum: '$amount' },
					paidInvoices: {
						$sum: {
							$cond: [
								{ $eq: ['$transactionStatus', 'paid'] },
								1,
								0,
							],
						},
					},
					paidAmount: {
						$sum: {
							$cond: [
								{ $eq: ['$transactionStatus', 'paid'] },
								'$amount',
								0,
							],
						},
					},
					pendingAmount: {
						$sum: {
							$cond: [
								{ $eq: ['$transactionStatus', 'pending'] },
								'$amount',
								0,
							],
						},
					},
				},
			},
		]);

		return NextResponse.json({
			success: true,
			data: {
				period,
				clients: clientStats[0] || {
					totalClients: 0,
					activeClients: 0,
					vipClients: 0,
					prospectClients: 0,
				},
				newClients: newClientsCount,
				services: serviceStats[0] || {
					totalServices: 0,
					completedServices: 0,
					pendingServices: 0,
					inProgressServices: 0,
					totalCost: 0,
				},
				transactions: transactionStats[0] || {
					totalTransactions: 0,
					totalAmount: 0,
					completedTransactions: 0,
					pendingAmount: 0,
				},
				invoices: invoiceStats[0] || {
					totalInvoices: 0,
					totalAmount: 0,
					paidInvoices: 0,
					paidAmount: 0,
					pendingAmount: 0,
				},
			},
		});
	} catch (error) {
		console.error('Error fetching dashboard stats:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch dashboard stats' },
			{ status: 500 }
		);
	}
}
