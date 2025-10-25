import { PrismaClient } from './generated/prisma/index.js'

const prisma = new PrismaClient()

async function cleanup() {
  console.log('🧹 Cleaning up GUEST users...\n')

  try {
    // Delete all GUEST users (visitors who haven't been approved yet)
    const result = await prisma.user.deleteMany({
      where: {
        role: 'GUEST',
      },
    })

    console.log(`✅ Deleted ${result.count} GUEST user(s)`)
    console.log('\n📊 Remaining users:')
    
    const users = await prisma.user.findMany()
    users.forEach(u => {
      console.log(`  - ID: ${u.id}, Name: ${u.firstName} ${u.lastName}, Role: ${u.role}`)
    })

    console.log('\n✅ Cleanup complete!')
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanup()
