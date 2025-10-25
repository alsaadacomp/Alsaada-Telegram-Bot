import { PrismaClient } from './generated/prisma/index.js'

const prisma = new PrismaClient()

async function checkJoinRequests() {
  console.log('🔍 Checking Join Requests in Detail...\n')

  try {
    const joinRequests = await prisma.joinRequest.findMany({
      include: {
        User_JoinRequest_userIdToUser: true,
        User_JoinRequest_approvedByToUser: true,
        User_JoinRequest_rejectedByToUser: true,
      }
    })

    console.log(`Total Join Requests: ${joinRequests.length}\n`)

    joinRequests.forEach((jr, index) => {
      console.log(`\n--- Join Request #${index + 1} ---`)
      console.log(`ID: ${jr.id}`)
      console.log(`Telegram ID: ${jr.telegramId}`)
      console.log(`Username: ${jr.username || 'N/A'}`)
      console.log(`Full Name: ${jr.fullName}`)
      console.log(`Nickname: ${jr.nickname || 'N/A'}`)
      console.log(`Phone: ${jr.phone}`)
      console.log(`Status: ${jr.status}`)
      console.log(`Requested At: ${jr.requestedAt}`)
      console.log(`Responded At: ${jr.respondedAt || 'N/A'}`)
      console.log(`Approved By: ${jr.approvedBy || 'N/A'}`)
      console.log(`Rejected By: ${jr.rejectedBy || 'N/A'}`)
      console.log(`Rejection Reason: ${jr.rejectionReason || 'N/A'}`)
      console.log(`Notes: ${jr.notes || 'N/A'}`)
      console.log(`User ID: ${jr.userId || 'N/A'}`)
    })

    console.log('\n✅ Join Request check complete!')
  } catch (error) {
    console.error('❌ Error checking join requests:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkJoinRequests()
