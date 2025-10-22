/**
 * Data Table Demo Handler - عرض مبسط
 */

import type { Context } from '../../../context.js'
import { Composer } from 'grammy'

export const tableDemoHandler = new Composer<Context>()

tableDemoHandler.callbackQuery(/^menu:sub:test-feature:table-demo$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    await ctx.editMessageText(
      '📊 **Data Tables Module - عرض توضيحي**\n\n'
      + 'يستخدم هذا القسم **Data Tables Module** المبني مسبقاً!\n\n'
      + '**المميزات:**\n'
      + '✅ DataTable - بناء جداول بيانات\n'
      + '✅ Column - تعريف أعمدة (text, number, date, boolean)\n'
      + '✅ Sorting - ترتيب تصاعدي/تنازلي\n'
      + '✅ Filtering - تصفية بشروط متعددة\n'
      + '✅ Pagination - تصفح الصفحات\n'
      + '✅ Export - تصدير (CSV, JSON, HTML, Markdown)\n'
      + '✅ Prisma Integration - دمج مباشر مع قاعدة البيانات\n\n'
      + '**مثال كود:**\n'
      + '```typescript\n'
      + 'const table = new DataTable()\n'
      + '  .addColumn("name", "text", "الاسم")\n'
      + '  .addColumn("salary", "number", "الراتب")\n'
      + '  .addRow({ name: "أحمد", salary: 5000 })\n'
      + '  .sort("salary", "desc")\n'
      + '  .filter("salary", ">", 4000)\n'
      + '```\n\n'
      + '**إمكانيات التصدير:**\n'
      + '• `table.exportCSV()` - CSV للاكسل\n'
      + '• `table.exportJSON()` - JSON للبرمجة\n'
      + '• `table.exportHTML()` - HTML للويب\n'
      + '• `table.exportMarkdown()` - MD للتوثيق\n\n'
      + '**دمج Prisma:**\n'
      + '```typescript\n'
      + 'const users = await prisma.user.findMany()\n'
      + 'const table = DataTable.fromPrisma(users)\n'
      + '```\n\n'
      + '**الملفات:**\n'
      + '• `src/modules/interaction/data-tables/`\n'
      + '• 118 اختبار ✅ كلها نجحت\n\n'
      + '_💡 جاهز للاستخدام في مشاريعك!_',
      {
        parse_mode: 'Markdown',
      },
    )
  }
  catch (error) {
    console.error('Error in table demo:', error)
  }
})
