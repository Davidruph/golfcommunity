import pool from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { unlink } from 'fs/promises'

export async function PATCH(req: NextRequest) {
  const connection = await pool.getConnection()

  try {
    const formData = await req.formData()
    const body = Object.fromEntries(formData.entries())

    console.log('PATCH body:', body)

    // Check if user already exists
    const [existingCommunities] = (await connection.query(
      'SELECT * FROM communities WHERE name = ? AND id != ?',
      [body.name, body.id]
    )) as [Array<RowDataPacket>, unknown]

    if (existingCommunities && existingCommunities.length > 0) {
      connection.release()
      return NextResponse.json(
        { error: 'Community with this name already exists' },
        { status: 409 }
      )
    }

    const [existingCommunity] = (await connection.query('SELECT * FROM communities WHERE id = ?', [
      body.id,
    ])) as [Array<RowDataPacket>, unknown]

    if (!existingCommunity || existingCommunity.length === 0) {
      connection.release()
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    console.log('Existing communities for update check:', existingCommunity)

    const existingCommunityData = existingCommunity[0]

    const bannerImage = formData.get('bannerImage') as File | null

    // Handle banner image
    let imagePath = existingCommunityData.banner_image

    // Check if new image is provided and is a File (not just the existing path)
    if (bannerImage && bannerImage instanceof File && bannerImage.size > 0) {
      // Upload new image
      const bytes = await bannerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}-${bannerImage.name}`
      const filepath = join(process.cwd(), 'public', 'uploads', 'communities', filename)

      // Save file to public directory
      await writeFile(filepath, buffer)
      imagePath = `/uploads/communities/${filename}`

      // Delete old image if it exists
      if (existingCommunityData.banner_image) {
        try {
          const oldImagePath = join(process.cwd(), 'public', existingCommunityData.banner_image)
          await unlink(oldImagePath)
          console.log('Old image deleted:', existingCommunityData.banner_image)
        } catch (err) {
          console.error('Error deleting old image:', err)
          // Continue even if deletion fails
        }
      }
    }

    // Prepare user data
    const communityData = {
      name: body.name,
      description: body.description,
      timezone: body.timezone,
      banner_image: imagePath,
    }

    // Insert user
    const [Result] = (await connection.query('UPDATE communities SET ? WHERE id = ?', [
      communityData,
      body.id,
    ])) as [{ insertId: number; affectedRows: number }, unknown]

    const communityId = body.id

    // Update captain: try UPDATE first, if no rows affected then INSERT
    const [updateResult] = (await connection.query(
      'UPDATE community_members SET user_id = ? WHERE community_id = ? AND role = ?',
      [body.captain, communityId, 'captain']
    )) as [{ affectedRows: number }, unknown]

    // If no rows were updated, insert new captain
    if (updateResult.affectedRows === 0) {
      await connection.query(
        'INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)',
        [communityId, body.captain, 'captain']
      )
    }

    connection.release()

    return NextResponse.json(
      {
        message: 'Community registered successfully',
        communityId,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    connection.release()
    console.error('Registration error:', err)

    return NextResponse.json(
      {
        error: 'Database error',
        message: (err as Error)?.message || 'An error occurred during registration',
      },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}
