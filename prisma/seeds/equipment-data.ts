export const equipmentCategories = [
  {
    nameAr: 'معدات ثقيلة',
    nameEn: 'Heavy Equipment',
    code: 'HEAVY',
    description: 'معدات البناء والحفر الثقيلة',
    orderIndex: 1
  },
  {
    nameAr: 'سيارات',
    nameEn: 'Vehicles',
    code: 'VEH',
    description: 'سيارات النقل والخدمات',
    orderIndex: 2
  },
  {
    nameAr: 'معدات رفع',
    nameEn: 'Lifting Equipment',
    code: 'LIFT',
    description: 'معدات الرفع والتحميل',
    orderIndex: 3
  }
];

export const equipmentTypes = [
  // سيارات
  {
    categoryCode: 'VEH',
    nameAr: 'سيارة قلاب',
    nameEn: 'Dump Truck',
    code: 'DT',
    description: 'سيارة لنقل المواد والمخلفات',
    defaultCapacity: '5-15 طن',
    defaultFuelType: 'DIESEL',
    requiresLicense: true,
    licenseType: 'رخصة مهنية درجة ثالثة',
    orderIndex: 1
  },
  {
    categoryCode: 'VEH',
    nameAr: 'سيارة خدمات',
    nameEn: 'Service Vehicle',
    code: 'SV',
    description: 'سيارة للخدمات والنقل الخفيف',
    defaultCapacity: '1-3 طن',
    defaultFuelType: 'DIESEL',
    requiresLicense: true,
    licenseType: 'رخصة قيادة عادية',
    orderIndex: 2
  },
  
  // معدات ثقيلة
  {
    categoryCode: 'HEAVY',
    nameAr: 'لودر',
    nameEn: 'Loader',
    code: 'LD',
    description: 'معدة للتحميل والحفر',
    defaultCapacity: '2-5 متر مكعب',
    defaultFuelType: 'DIESEL',
    requiresLicense: true,
    licenseType: 'رخصة تشغيل معدات ثقيلة',
    orderIndex: 3
  },
  {
    categoryCode: 'HEAVY',
    nameAr: 'بلدوزر',
    nameEn: 'Bulldozer',
    code: 'BZ',
    description: 'معدة للتسوية والدفع',
    defaultCapacity: 'حسب الموديل',
    defaultFuelType: 'DIESEL',
    requiresLicense: true,
    licenseType: 'رخصة تشغيل معدات ثقيلة',
    orderIndex: 4
  },
  {
    categoryCode: 'HEAVY',
    nameAr: 'حفار',
    nameEn: 'Excavator',
    code: 'EX',
    description: 'معدة للحفر والتنقيب',
    defaultCapacity: '0.5-3 متر مكعب',
    defaultFuelType: 'DIESEL',
    requiresLicense: true,
    licenseType: 'رخصة تشغيل معدات ثقيلة',
    orderIndex: 5
  }
];

export const defaultShifts = [
  {
    name: 'الوردية الصباحية',
    nameEn: 'Morning Shift',
    shiftType: 'MORNING',
    startTime: '07:00',
    endTime: '15:00',
    duration: 8,
    breakDuration: 60
  },
  {
    name: 'الوردية المسائية',
    nameEn: 'Evening Shift',
    shiftType: 'EVENING',
    startTime: '15:00',
    endTime: '23:00',
    duration: 8,
    breakDuration: 60
  }
];
