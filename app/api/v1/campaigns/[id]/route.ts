import { unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const connection = await pool.getConnection()

  try {
    // Await the params to get the ID
    const { id } = await params

    // Get FormData instead of JSON
    const formData = await req.formData()

    // Extract fields
    const sponsoredKids = formData.get('sponsoredKids') as string
    const targetAmount = formData.get('targetAmount') as string
    const description = formData.get('description') as string
    const deadline = formData.get('deadline') as string
    const campaignTitle = formData.get('campaignTitle') as string
    const bannerImage = formData.get('bannerImage') as File | null

    console.log('Received campaign update data:', {
      id,
      sponsoredKids,
      targetAmount,
      description,
      bannerImage: bannerImage?.name,
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

    // Check if new image is provided and is a File (not just the existing path)
    if (bannerImage && bannerImage instanceof File && bannerImage.size > 0) {
      // Upload new image
      const bytes = await bannerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}-${bannerImage.name}`
      const filepath = join(process.cwd(), 'public', 'uploads', 'campaigns', filename)

      // Save file to public directory
      await writeFile(filepath, buffer)
      imagePath = `/uploads/campaigns/${filename}`

      // Delete old image if it exists
      if (existingCampaign.banner_image) {
        try {
          const oldImagePath = join(process.cwd(), 'public', existingCampaign.banner_image)
          await unlink(oldImagePath)
          console.log('Old image deleted:', existingCampaign.banner_image)
        } catch (err) {
          console.error('Error deleting old image:', err)
          // Continue even if deletion fails
        }
      }
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
