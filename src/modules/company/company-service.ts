/**
 * Company Service
 * خدمة إدارة بيانات الشركة
 */

import type { Company } from '../../../generated/prisma/index.js'
import { Database } from '../database/index.js'
import { logger } from '../services/logger/index.js'

export interface BankAccount {
  name: string
  account: string
  iban?: string
  swift?: string
  branch?: string
}

export interface CompanyUpdateData {
  name?: string
  nameEn?: string
  commercialRegister?: string
  taxId?: string
  insuranceNumber?: string
  address?: string
  addressEn?: string
  city?: string
  country?: string
  postalCode?: string
  phone?: string
  phone2?: string
  fax?: string
  mobile?: string
  email?: string
  email2?: string
  website?: string
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  logo?: string
  description?: string
  establishedYear?: number
  legalForm?: string
  capital?: number
  currency?: string
  taxOffice?: string
  taxRecord?: string
  chamberOfCommerce?: string
  ceo?: string
  ceoPhone?: string
  accountant?: string
  accountantPhone?: string
  notes?: string
  updatedBy?: number
}

export class CompanyService {
  /**
   * Get or create company (singleton pattern - only one company record)
   */
  static async getOrCreate(createdBy?: number): Promise<Company> {
    try {
      // Try to get existing company
      let company = await Database.prisma.company.findFirst({
        where: { isActive: true },
      })

      if (!company) {
        // Create default company
        company = await Database.prisma.company.create({
          data: {
            name: 'الشركة',
            isActive: true,
          },
        })
        logger.info({ companyId: company.id }, 'Company created')
      }

      return company
    }
    catch (error) {
      logger.error({ error }, 'Failed to get or create company')
      throw error
    }
  }

  /**
   * Update company information
   */
  static async update(data: CompanyUpdateData): Promise<Company> {
    try {
      const company = await this.getOrCreate(data.updatedBy)

      const updated = await Database.prisma.company.update({
        where: { id: company.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })

      logger.info({ companyId: updated.id, updatedBy: data.updatedBy }, 'Company updated')
      return updated
    }
    catch (error) {
      logger.error({ error }, 'Failed to update company')
      throw error
    }
  }

  /**
   * Get company
   */
  static async get(): Promise<Company | null> {
    try {
      return await Database.prisma.company.findFirst({
        where: { isActive: true },
      })
    }
    catch (error) {
      logger.error({ error }, 'Failed to get company')
      return null
    }
  }

  /**
   * Get bank accounts (parsed from JSON)
   */
  static async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const company = await this.get()
      if (!company || !company.bankAccounts) {
        return []
      }
      return JSON.parse(company.bankAccounts)
    }
    catch (error) {
      logger.error({ error }, 'Failed to parse bank accounts')
      return []
    }
  }

  /**
   * Update bank accounts
   */
  static async updateBankAccounts(accounts: BankAccount[], updatedBy?: number): Promise<void> {
    try {
      const company = await this.getOrCreate(updatedBy)
      await Database.prisma.company.update({
        where: { id: company.id },
        data: {
          bankAccounts: JSON.stringify(accounts),
        },
      })
      logger.info({ companyId: company.id }, 'Bank accounts updated')
    }
    catch (error) {
      logger.error({ error }, 'Failed to update bank accounts')
      throw error
    }
  }

  /**
   * Get formatted company info (for display)
   */
  static async getFormattedInfo(): Promise<string> {
    try {
      const company = await this.get()
      if (!company) {
        return 'لا توجد بيانات للشركة'
      }

      let info = `🏢 **${company.name}**\n\n`

      if (company.nameEn)
        info += `📝 الاسم بالإنجليزية: ${company.nameEn}\n`
      if (company.commercialRegister)
        info += `📋 السجل التجاري: ${company.commercialRegister}\n`
      if (company.taxId)
        info += `💳 البطاقة الضريبية: ${company.taxId}\n`
      if (company.insuranceNumber)
        info += `🛡️ الرقم التأميني: ${company.insuranceNumber}\n`

      if (company.address)
        info += `\n📍 **العنوان:**\n${company.address}\n`
      if (company.city)
        info += `🏙️ المدينة: ${company.city}\n`
      if (company.country)
        info += `🌍 الدولة: ${company.country}\n`

      if (company.phone)
        info += `\n📞 التليفون: ${company.phone}\n`
      if (company.mobile)
        info += `📱 الموبايل: ${company.mobile}\n`
      if (company.email)
        info += `✉️ الإيميل: ${company.email}\n`
      if (company.website)
        info += `🌐 الموقع: ${company.website}\n`

      return info
    }
    catch (error) {
      logger.error({ error }, 'Failed to format company info')
      return 'حدث خطأ أثناء عرض بيانات الشركة'
    }
  }
}
