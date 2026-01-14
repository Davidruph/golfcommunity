import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const connection = await pool.getConnection()

  try {
    // Await the params to get the ID
    const { id } = await params

    // Get FormData instead of JSON
    const formData = await req.json()

    // Extract fields
    const sponsoredKids = formData.sponsoredKids as string
    const targetAmount = formData.targetAmount as string
    const description = formData.description as string
    const deadline = formData.deadline as string
    const campaignTitle = formData.campaignTitle as string
    const bannerImage = formData.bannerImage as string | null

    console.log('Received campaign update data:', {
      id,
      sponsoredKids,
      targetAmount,
      description,
      bannerImage,
      deadline,
      campaignTitle,
    })

    // Fetch existing campaign
    const [existingCampaigns] = (await connection.query('SELECT * FROM campaigns WHERE id = ?', [
      id,
    ])) as [Array<RowDataPacket>, unknown]

    if (!existingCampaigns || existingCampaigns.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const existingCampaign = existingCampaigns[0]

    // Check for duplicate campaign title (excluding current campaign)
    if (campaignTitle && campaignTitle !== existingCampaign.campaign_title) {
      const [duplicateCampaign] = (await connection.query(
        'SELECT id FROM campaigns WHERE campaign_title = ? AND id != ?',
        [campaignTitle, id]
      )) as [Array<RowDataPacket>, unknown]

      if (duplicateCampaign && duplicateCampaign.length > 0) {
        return NextResponse.json(
          { error: 'Campaign with this title already exists' },
          { status: 409 }
        )
      }
    }

    // Handle banner image
    let imagePath = existingCampaign.banner_image

    if (bannerImage && bannerImage !== existingCampaign.banner_image) {
      imagePath = bannerImage
    }

    // Prepare update data
    const campaignData: Record<string, unknown> = {}

    if (sponsoredKids) campaignData.sponsored_kid = parseInt(sponsoredKids)
    if (targetAmount) campaignData.target_amount = parseFloat(targetAmount)
    if (description) campaignData.description = description
    if (deadline) campaignData.deadline = new Date(deadline)
    if (campaignTitle) campaignData.campaign_title = campaignTitle
    campaignData.banner_image = imagePath

    // Update database
    await connection.query('UPDATE campaigns SET ? WHERE id = ?', [campaignData, id])

    return NextResponse.json(
      {
        message: 'Campaign updated successfully',
        imagePath,
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    console.error('Campaign update error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during campaign update',
      },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}
