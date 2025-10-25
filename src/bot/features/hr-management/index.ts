/**
 * HR Management Feature Module
 */

import type { Context } from '../../context.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer } from 'grammy'
import { hrManagementConfig } from './config.js'

import { advancesHandler } from './handlers/advances-main.handler.js'

import { newAdvanceHandler } from './handlers/advances-new.handler.js'
import { advancesReportsHandler } from './handlers/advances-reports.handler.js'
import { viewAdvancesHandler } from './handlers/advances-view.handler.js'
import { employeeDetailsHandler } from './handlers/employee-details.handler.js'
import { employeeEditHandler } from './handlers/employee-edit.handler.js'
import { employeeStatusSimpleHandler } from './handlers/employee-status-simple.handler.js'
import { addEmployeeHandler } from './handlers/employees-add.handler.js'
// Import handlers
import { employeesListHandler } from './handlers/employees-list.handler.js'
import { viewCurrentEmployeesHandler } from './handlers/employees-view-current.handler.js'
import { viewPreviousEmployeesHandler } from './handlers/employees-view-previous.handler.js'
// Import main handler
import { hrMainHandler } from './handlers/hr-main.handler.js'
import { leavesHandler } from './handlers/leaves.handler.js'
import { payrollHandler } from './handlers/payroll.handler.js'

export const composer = new Composer<Context>()

// Register main handler first
composer.use(hrMainHandler)

// Register section handlers
composer.use(employeesListHandler)
composer.use(advancesHandler)
composer.use(leavesHandler)
composer.use(payrollHandler)

// Register sub-handlers
composer.use(addEmployeeHandler)
composer.use(viewCurrentEmployeesHandler)
composer.use(viewPreviousEmployeesHandler)
composer.use(employeeDetailsHandler)
composer.use(employeeEditHandler)
composer.use(employeeStatusSimpleHandler)
composer.use(newAdvanceHandler)
composer.use(viewAdvancesHandler)
composer.use(advancesReportsHandler)

export { hrManagementConfig as config }

export async function init(): Promise<void> {
  logger.info('✅ HR Management Feature initialized')
}

export async function cleanup(): Promise<void> {
  logger.info('🔄 HR Management Feature cleaned up')
}
