import { PrismaClient } from './generated/prisma/index.js'

const prisma = new PrismaClient()

async function testEmployeeViews() {
  try {
    console.log('🧪 اختبار وظائف عرض العاملين...\n')

    // اختبار العاملين الحاليين
    console.log('👷 اختبار العاملين الحاليين:')
    const currentEmployees = await prisma.hR_Employee.findMany({
      where: {
        isActive: true,
        employmentStatus: 'ACTIVE'
      },
      include: {
        position: {
          select: {
            titleAr: true,
            title: true,
            code: true
          }
        },
        department: {
          select: {
            name: true,
            code: true
          }
        },
        governorate: {
          select: {
            nameAr: true,
            code: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`   📊 عدد العاملين الحاليين: ${currentEmployees.length}`)
    currentEmployees.forEach((emp, index) => {
      const positionName = emp.position ? (emp.position.titleAr || emp.position.title) : 'غير محدد'
      const departmentName = emp.department ? emp.department.name : 'غير محدد'
      const governorateName = emp.governorate ? emp.governorate.nameAr : 'غير محدد'
      
      console.log(`   ${index + 1}. ${emp.fullName} (${emp.employeeCode})`)
      console.log(`      💼 الوظيفة: ${positionName}`)
      console.log(`      📋 القسم: ${departmentName}`)
      console.log(`      📍 المحافظة: ${governorateName}`)
      console.log(`      ✅ الحالة: ${emp.isActive ? 'نشط' : 'غير نشط'}`)
    })

    console.log('\n📂 اختبار العاملين السابقين:')
    const previousEmployees = await prisma.hR_Employee.findMany({
      where: {
        OR: [
          { isActive: false },
          { employmentStatus: { in: ['RESIGNED', 'TERMINATED'] } },
          { resignationDate: { not: null } },
          { terminationDate: { not: null } }
        ]
      },
      include: {
        position: {
          select: {
            titleAr: true,
            title: true,
            code: true
          }
        },
        department: {
          select: {
            name: true,
            code: true
          }
        },
        governorate: {
          select: {
            nameAr: true,
            code: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`   📊 عدد العاملين السابقين: ${previousEmployees.length}`)
    if (previousEmployees.length > 0) {
      previousEmployees.forEach((emp, index) => {
        const positionName = emp.position ? (emp.position.titleAr || emp.position.title) : 'غير محدد'
        const departmentName = emp.department ? emp.department.name : 'غير محدد'
        const governorateName = emp.governorate ? emp.governorate.nameAr : 'غير محدد'
        
        let endReason = 'غير محدد'
        if (emp.resignationDate) {
          endReason = 'استقالة'
        } else if (emp.terminationDate) {
          endReason = 'فصل'
        } else if (emp.employmentStatus === 'RESIGNED') {
          endReason = 'استقالة'
        } else if (emp.employmentStatus === 'TERMINATED') {
          endReason = 'فصل'
        }
        
        console.log(`   ${index + 1}. ${emp.fullName} (${emp.employeeCode})`)
        console.log(`      💼 الوظيفة: ${positionName}`)
        console.log(`      📋 القسم: ${departmentName}`)
        console.log(`      📍 المحافظة: ${governorateName}`)
        console.log(`      📝 سبب انتهاء العمل: ${endReason}`)
        console.log(`      ❌ الحالة: ${emp.isActive ? 'نشط' : 'غير نشط'}`)
      })
    } else {
      console.log('   ✅ لا يوجد عاملين سابقين')
    }

    console.log('\n📈 إحصائيات عامة:')
    const totalEmployees = await prisma.hR_Employee.count()
    const activeEmployees = await prisma.hR_Employee.count({
      where: { isActive: true }
    })
    const inactiveEmployees = await prisma.hR_Employee.count({
      where: { isActive: false }
    })

    console.log(`   👥 إجمالي الموظفين: ${totalEmployees}`)
    console.log(`   ✅ الموظفين النشطين: ${activeEmployees}`)
    console.log(`   ❌ الموظفين غير النشطين: ${inactiveEmployees}`)

    console.log('\n✅ تم اختبار الوظائف بنجاح!')
    console.log('🎯 يمكنك الآن استخدام أزرار "عرض العاملين الحاليين" و "عرض العاملين السابقين" في البوت')

  } catch (error) {
    console.error('❌ خطأ في اختبار الوظائف:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testEmployeeViews()
