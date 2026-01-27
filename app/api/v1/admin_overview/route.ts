import pool from '@/lib/db'
import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  let connection

  try {
    connection = await pool.getConnection()

    // TOTAL USERS
    const [[{ totalUsers }]] = await connection.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS totalUsers FROM users'
    )

    const [[{ usersThisMonth }]] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS usersThisMonth
       FROM users
       WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`
    )

    const [[{ usersLastMonth }]] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS usersLastMonth
       FROM users
       WHERE created_at >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
         AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')`
    )

    const usersGrowth =
      usersLastMonth === 0 ? 0 : ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100

    // TOTAL COMMUNITIES
    const [[{ totalCommunities }]] = await connection.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS totalCommunities FROM communities'
    )

    const [[{ newCommunitiesThisWeek }]] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS newCommunitiesThisWeek
       FROM communities
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
    )

    // TOTAL SPONSORS
    const [[{ totalSponsors }]] = await connection.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS totalSponsors FROM sponsors'
    )

    const [[{ sponsorsThisMonth }]] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS sponsorsThisMonth
       FROM sponsors
       WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`
    )

    const [[{ sponsorsLastMonth }]] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS sponsorsLastMonth
       FROM sponsors
       WHERE created_at >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
         AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')`
    )

    const sponsorsGrowth =
      sponsorsLastMonth === 0
        ? 0
        : ((sponsorsThisMonth - sponsorsLastMonth) / sponsorsLastMonth) * 100

    const [[{ captainCount }]] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT user_id) AS captainCount
   FROM community_members
   WHERE role = 'captain'`
    )

    // Get user growth by month for the last 9 months
    const [userGrowthRows] = await connection.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(created_at, '%b') AS month, COUNT(*) AS count
   FROM users
   WHERE created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 8 MONTH), '%Y-%m-01')
   GROUP BY month, YEAR(created_at), MONTH(created_at)
   ORDER BY YEAR(created_at), MONTH(created_at)`
    )

    // Prepare arrays for chart
    const userGrowthCategories = userGrowthRows.map((row) => row.month)
    const userGrowthData = userGrowthRows.map((row) => row.count)

    // Get revenue and sponsorship by month for the last 9 months
    const [donationRows] = await connection.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(created_at, '%b') AS month,
          SUM(amount_donated) AS revenue,
          SUM(kid_sponsored) AS sponsorship
   FROM donations
   WHERE created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 8 MONTH), '%Y-%m-01')
   GROUP BY month, YEAR(created_at), MONTH(created_at)
   ORDER BY YEAR(created_at), MONTH(created_at)`
    )

    const revenueCategories = donationRows.map((row) => row.month)
    const revenueData = donationRows.map((row) => Number(row.revenue) || 0)
    const sponsorshipData = donationRows.map((row) => Number(row.sponsorship) || 0)

    return NextResponse.json(
      {
        totalUsers: {
          count: totalUsers,
          change: `+${usersGrowth.toFixed(1)}%`,
          period: 'from last month',
        },
        totalCommunities: {
          count: totalCommunities,
          change: `+${newCommunitiesThisWeek}`,
          period: 'new this week',
        },
        totalSponsors: {
          count: totalSponsors,
          change: `+${sponsorsGrowth.toFixed(1)}%`,
          period: 'from last month',
        },
        totalCaptains: {
          count: captainCount,
          period: 'total',
        },
        userGrowth: {
          categories: userGrowthCategories,
          data: userGrowthData,
        },
        revenue: {
          categories: revenueCategories,
          revenue: revenueData,
          sponsorship: sponsorshipData,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Dashboard stats fetch error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}
