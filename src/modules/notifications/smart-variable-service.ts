/**
 * Smart Variable Service
 * خدمة المتغيرات الذكية - ملء المتغيرات تلقائياً من قاعدة البيانات
 */

import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'

export interface VariableValue {
  key: string
  value: string
  source: 'company' | 'user' | 'system' | 'manual'
  description: string
}

export interface VariableContext {
  userId?: number
  companyId?: number
  templateId?: string
}

export class SmartVariableService {
  /**
   * Get available variables for a template
   */
  async getAvailableVariables(templateId: string): Promise<VariableValue[]> {
    try {
      logger.info(`Getting available variables for template: ${templateId}`)
      const template = await Database.prisma.notificationTemplate.findUnique({
        where: { id: templateId },
        select: { message: true },
      })

      if (!template) {
        logger.warn(`Template not found: ${templateId}`)
        return []
      }

      logger.info(`Template message: ${template.message}`)

      // Extract variables from template message
      const variables = this.extractVariablesFromMessage(template.message)
      logger.info(`Extracted variables: ${JSON.stringify(variables)}`)

      // Get values for each variable
      const variableValues: VariableValue[] = []

      for (const variable of variables) {
        const value = await this.getVariableValue(variable)
        if (value) {
          variableValues.push(value)
        }
      }

      logger.info(`Final variable values: ${JSON.stringify(variableValues.map(v => v.key))}`)
      return variableValues
    }
    catch (error) {
      logger.error({ error, templateId }, 'Failed to get available variables')
      return []
    }
  }

  /**
   * Extract variables from template message
   */
  private extractVariablesFromMessage(message: string): string[] {
    const variableRegex = /\{\{([^}]+)\}\}/g
    const variables: string[] = []
    let match = variableRegex.exec(message)

    while (match !== null) {
      const variable = match[1].trim()
      if (!variables.includes(variable)) {
        variables.push(variable)
      }
      match = variableRegex.exec(message)
    }

    return variables
  }

  /**
   * Get value for a specific variable
   */
  private async getVariableValue(variable: string): Promise<VariableValue | null> {
    try {
      // Company variables
      if (variable.startsWith('company')) {
        return await this.getCompanyVariable(variable)
      }

      // User variables
      if (variable.startsWith('user') || variable === 'fullName' || variable === 'nickname') {
        return await this.getUserVariable(variable)
      }

      // System variables
      if (variable.startsWith('system') || variable === 'date' || variable === 'time') {
        return this.getSystemVariable(variable)
      }

      // Default company name
      if (variable === 'companyName') {
        return await this.getCompanyVariable('companyName')
      }

      // Custom variables (like subject, location, etc.) - return placeholder
      return this.getCustomVariable(variable)
    }
    catch (error) {
      logger.error({ error, variable }, 'Failed to get variable value')
      return null
    }
  }

  /**
   * Get custom variable value (placeholder for manual input)
   */
  private getCustomVariable(variable: string): VariableValue {
    const customVariables: Record<string, { value: string, description: string }> = {
      subject: { value: '[موضوع الاجتماع]', description: 'موضوع الاجتماع' },
      location: { value: '[مكان الاجتماع]', description: 'مكان الاجتماع' },
      message: { value: '[الرسالة]', description: 'نص الرسالة' },
      duration: { value: '[المدة المتوقعة]', description: 'المدة المتوقعة للصيانة' },
    }

    const variableData = customVariables[variable]
    if (variableData) {
      return {
        key: variable,
        value: variableData.value,
        source: 'manual',
        description: variableData.description,
      }
    }

    // Generic custom variable
    return {
      key: variable,
      value: `[${variable}]`,
      source: 'manual',
      description: `متغير مخصص: ${variable}`,
    }
  }

  /**
   * Get company variable value
   */
  private async getCompanyVariable(variable: string): Promise<VariableValue | null> {
    try {
      const company = await Database.prisma.company.findFirst({
        where: { isActive: true },
        select: {
          name: true,
          nameEn: true,
          address: true,
          city: true,
          country: true,
          phone: true,
          email: true,
          website: true,
          ceo: true,
          establishedYear: true,
        },
      })

      if (!company) {
        return null
      }

      const companyVariables: Record<string, { value: string, description: string }> = {
        companyName: { value: company.name, description: 'اسم الشركة' },
        companyNameEn: { value: company.nameEn || company.name, description: 'اسم الشركة بالإنجليزية' },
        companyAddress: { value: company.address || '', description: 'عنوان الشركة' },
        companyCity: { value: company.city || '', description: 'مدينة الشركة' },
        companyCountry: { value: company.country || '', description: 'دولة الشركة' },
        companyPhone: { value: company.phone || '', description: 'هاتف الشركة' },
        companyEmail: { value: company.email || '', description: 'بريد الشركة الإلكتروني' },
        companyWebsite: { value: company.website || '', description: 'موقع الشركة الإلكتروني' },
        companyCEO: { value: company.ceo || '', description: 'المدير التنفيذي' },
        companyEstablishedYear: { value: company.establishedYear?.toString() || '', description: 'سنة التأسيس' },
      }

      const variableData = companyVariables[variable]
      if (variableData) {
        return {
          key: variable,
          value: variableData.value,
          source: 'company',
          description: variableData.description,
        }
      }

      return null
    }
    catch (error) {
      logger.error({ error, variable }, 'Failed to get company variable')
      return null
    }
  }

  /**
   * Get user variable value
   */
  private async getUserVariable(variable: string): Promise<VariableValue | null> {
    try {
      // This would need to be called with a specific user context
      // For now, return a placeholder
      const userVariables: Record<string, { value: string, description: string }> = {
        fullName: { value: '[اسم المستخدم]', description: 'الاسم الكامل للمستخدم (سيظهر اسم كل مستخدم في رسالته)' },
        nickname: { value: '[اسم الشهرة]', description: 'اسم الشهرة للمستخدم (سيظهر اسم كل مستخدم في رسالته)' },
        userPhone: { value: '[رقم الموبيل]', description: 'رقم الموبيل للمستخدم (سيظهر رقم كل مستخدم في رسالته)' },
        userEmail: { value: '[البريد الإلكتروني]', description: 'البريد الإلكتروني للمستخدم (سيظهر بريد كل مستخدم في رسالته)' },
        userRole: { value: '[الدور]', description: 'دور المستخدم في النظام (سيظهر دور كل مستخدم في رسالته)' },
      }

      const variableData = userVariables[variable]
      if (variableData) {
        return {
          key: variable,
          value: variableData.value,
          source: 'user',
          description: variableData.description,
        }
      }

      return null
    }
    catch (error) {
      logger.error({ error, variable }, 'Failed to get user variable')
      return null
    }
  }

  /**
   * Get system variable value
   */
  private getSystemVariable(variable: string): VariableValue | null {
    const now = new Date()

    const systemVariables: Record<string, { value: string, description: string }> = {
      date: { value: now.toLocaleDateString('ar-EG'), description: 'التاريخ الحالي' },
      time: { value: now.toLocaleTimeString('ar-EG'), description: 'الوقت الحالي' },
      datetime: { value: now.toLocaleString('ar-EG'), description: 'التاريخ والوقت الحالي' },
      year: { value: now.getFullYear().toString(), description: 'السنة الحالية' },
      month: { value: (now.getMonth() + 1).toString(), description: 'الشهر الحالي' },
      day: { value: now.getDate().toString(), description: 'اليوم الحالي' },
    }

    const variableData = systemVariables[variable]
    if (variableData) {
      return {
        key: variable,
        value: variableData.value,
        source: 'system',
        description: variableData.description,
      }
    }

    return null
  }

  /**
   * Fill template with variable values
   */
  async fillTemplate(templateId: string, variableValues: Record<string, string>): Promise<string> {
    try {
      const template = await Database.prisma.notificationTemplate.findUnique({
        where: { id: templateId },
        select: { message: true },
      })

      if (!template) {
        throw new Error('Template not found')
      }

      let filledMessage = template.message

      // Replace variables with values
      for (const [key, value] of Object.entries(variableValues)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        filledMessage = filledMessage.replace(regex, value)
      }

      return filledMessage
    }
    catch (error) {
      logger.error({ error, templateId, variableValues }, 'Failed to fill template')
      throw error
    }
  }

  /**
   * Get user-specific variable values
   */
  async getUserVariableValues(userId: number): Promise<Record<string, string>> {
    try {
      const user = await Database.prisma.user.findUnique({
        where: { id: userId },
        select: {
          fullName: true,
          nickname: true,
          phone: true,
          email: true,
          role: true,
        },
      })

      if (!user) {
        return {}
      }

      return {
        fullName: user.fullName || user.nickname || '[اسم المستخدم]',
        nickname: user.nickname || '[اسم الشهرة]',
        userPhone: user.phone || '[رقم الموبيل]',
        userEmail: user.email || '[البريد الإلكتروني]',
        userRole: user.role || '[الدور]',
      }
    }
    catch (error) {
      logger.error({ error, userId }, 'Failed to get user variable values')
      return {}
    }
  }

  /**
   * Get all company variable values
   */
  async getCompanyVariableValues(): Promise<Record<string, string>> {
    try {
      const company = await Database.prisma.company.findFirst({
        where: { isActive: true },
        select: {
          name: true,
          nameEn: true,
          address: true,
          city: true,
          country: true,
          phone: true,
          email: true,
          website: true,
          ceo: true,
          establishedYear: true,
        },
      })

      if (!company) {
        return {}
      }

      return {
        companyName: company.name,
        companyNameEn: company.nameEn || company.name,
        companyAddress: company.address || '',
        companyCity: company.city || '',
        companyCountry: company.country || '',
        companyPhone: company.phone || '',
        companyEmail: company.email || '',
        companyWebsite: company.website || '',
        companyCEO: company.ceo || '',
        companyEstablishedYear: company.establishedYear?.toString() || '',
      }
    }
    catch (error) {
      logger.error({ error }, 'Failed to get company variable values')
      return {}
    }
  }
}

export const smartVariableService = new SmartVariableService()
