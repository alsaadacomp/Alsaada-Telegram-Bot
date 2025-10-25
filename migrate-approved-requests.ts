import { PrismaClient } from './generated/prisma/index.js'

const prisma = new PrismaClient()

async function migrateApprovedRequests() {
  console.log('🔄 Migrating approved join requests...\n')

  try {
    // Find all APPROVED requests
    const approvedRequests = await prisma.joinRequest.findMany({
      where: {
        status: 'APPROVED',
      },
    })

    if (approvedRequests.length === 0) {
      console.log('✅ No approved requests found to migrate.')
      return
    }

    console.log(`Found ${approvedRequests.length} approved request(s) to migrate:\n`)

    for (const request of approvedRequests) {
      console.log(`Processing: ${request.fullName} (${request.phone})`)

      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { telegramId: request.telegramId },
        })

        if (existingUser) {
          console.log(`  ⚠️  User already exists (ID: ${existingUser.id})`)
          console.log(`  🗑️  Deleting join request...`)
          
          // Just delete the request since user exists
          await prisma.joinRequest.delete({
            where: { id: request.id },
          })
          
          console.log(`  ✅ Join request deleted\n`)
          continue
        }

        // Create user from join request
        const user = await prisma.user.create({
          data: {
            telegramId: request.telegramId,
            username: request.username,
            fullName: request.fullName,
            nickname: request.nickname,
            phone: request.phone,
            role: 'USER',
            isActive: true,
          },
        })

        console.log(`  ✅ User created (ID: ${user.id})`)

        // Delete the join request
        await prisma.joinRequest.delete({
          where: { id: request.id },
        })

        console.log(`  ✅ Join request deleted\n`)
      } catch (error) {
        console.error(`  ❌ Error processing ${request.fullName}:`, error)
        console.log()
      }
    }

    console.log('\n📊 Final Status:')
    const userCount = await prisma.user.count()
    const joinRequestCount = await prisma.joinRequest.count()
    
    console.log(`  Users: ${userCount}`)
    console.log(`  Join Requests: ${joinRequestCount}`)
    
    console.log('\n✅ Migration complete!')
  } catch (error) {
    console.error('❌ Error during migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateApprovedRequests()
