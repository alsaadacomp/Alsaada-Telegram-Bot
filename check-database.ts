import { PrismaClient } from './generated/prisma/index.js'

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 Checking Database Content...\n')

  try {
    // Check Company
    console.log('📊 Company Table:')
    const companies = await prisma.company.findMany()
    console.log(`Total records: ${companies.length}`)
    companies.forEach(c => {
      console.log(`  - ID: ${c.id}, Name: ${c.name}, NameEn: ${c.nameEn}, Active: ${c.isActive}`)
    })
    console.log()

    // Check Users
    console.log('👥 User Table:')
    const users = await prisma.user.findMany()
    console.log(`Total records: ${users.length}`)
    users.forEach(u => {
      console.log(`  - ID: ${u.id}, TelegramID: ${u.telegramId}, Name: ${u.firstName} ${u.lastName}, Username: ${u.username}, Role: ${u.role}`)
    })
    console.log()

    // Check Join Requests
    console.log('📝 JoinRequest Table:')
    const joinRequests = await prisma.joinRequest.findMany()
    console.log(`Total records: ${joinRequests.length}`)
    joinRequests.forEach(jr => {
      console.log(`  - ID: ${jr.id}, TelegramID: ${jr.telegramId}, Name: ${jr.fullName}, Phone: ${jr.phone}, Status: ${jr.status}`)
    })
    console.log()

    // Check Departments
    console.log('🏢 Department Table:')
    const departments = await prisma.department.findMany()
    console.log(`Total records: ${departments.length}`)
    console.log()

    // Check Positions
    console.log('💼 Position Table:')
    const positions = await prisma.position.findMany()
    console.log(`Total records: ${positions.length}`)
    console.log()

    // Check Governorates
    console.log('🌍 Governorate Table:')
    const governorates = await prisma.governorate.findMany()
    console.log(`Total records: ${governorates.length}`)
    console.log()

    console.log('✅ Database check complete!')
  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
