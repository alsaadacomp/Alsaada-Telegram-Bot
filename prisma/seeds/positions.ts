// الوظائف مع أكواد الأقسام (سيتم ربطها بـ departmentId في seed.ts)
export const positionsData = [
  // إدارة التغذية (CAT) - 2 وظيفة
  {
    title: 'Cook',
    titleAr: 'طباخ',
    code: 'CAT-01',
    departmentCode: 'CAT',
    orderIndex: 1,
    defaultWorkDaysPerCycle: 30,
    defaultLeaveDaysPerCycle: 10,
  },
  {
    title: 'Catering Chef',
    titleAr: 'رئيس طهاة',
    code: 'CAT-02',
    departmentCode: 'CAT',
    orderIndex: 2,
    defaultWorkDaysPerCycle: 30,
    defaultLeaveDaysPerCycle: 10,
  },

  // إدارة الصيانة (MNT) - 4 وظائف
  {
    title: 'General Maintenance Assistant',
    titleAr: 'مساعد صيانة عامة',
    code: 'MNT-01',
    departmentCode: 'MNT',
    orderIndex: 1,
  },
  {
    title: 'Equipment Maintenance Technician',
    titleAr: 'فني صيانة معدات',
    code: 'MNT-02',
    departmentCode: 'MNT',
    orderIndex: 2,
  },
  {
    title: 'Loader Maintenance Technician',
    titleAr: 'فني صيانة لودر',
    code: 'MNT-03',
    departmentCode: 'MNT',
    orderIndex: 3,
  },
  {
    title: 'Car Maintenance Technician',
    titleAr: 'فني صيانة سيارات',
    code: 'MNT-04',
    departmentCode: 'MNT',
    orderIndex: 4,
  },

  // إدارة المعدات (EQP) - 3 وظائف
  {
    title: 'Excavator Driver',
    titleAr: 'سائق حفار',
    code: 'EQP-01',
    departmentCode: 'EQP',
    orderIndex: 1,
    defaultWorkDaysPerCycle: 21,
    defaultLeaveDaysPerCycle: 7,
  },
  {
    title: 'Bulldozer Driver',
    titleAr: 'سائق بلدوزر',
    code: 'EQP-02',
    departmentCode: 'EQP',
    orderIndex: 2,
  },
  {
    title: 'Loader Driver',
    titleAr: 'سائق لودر',
    code: 'EQP-03',
    departmentCode: 'EQP',
    orderIndex: 3,
  },

  // إدارة المركبات (VEH) - 2 وظيفة
  {
    title: 'Site Service Car Driver',
    titleAr: 'سائق سيارة خدمة',
    code: 'VEH-01',
    departmentCode: 'VEH',
    orderIndex: 1,
  },
  {
    title: 'Dump Truck Driver',
    titleAr: 'سائق قلاب',
    code: 'VEH-02',
    departmentCode: 'VEH',
    orderIndex: 2,
  },

  // إدارة المشاريع والإشراف (PRJ) - 2 وظيفة
  {
    title: 'Site Clerk',
    titleAr: 'كاتب موقع',
    code: 'PRJ-01',
    departmentCode: 'PRJ',
    orderIndex: 1,
  },
  {
    title: 'Site Supervisor',
    titleAr: 'مشرف موقع',
    code: 'PRJ-02',
    departmentCode: 'PRJ',
    orderIndex: 2,
  },

  // الإدارة الهندسية (ENG) - 3 وظائف
  {
    title: 'Assistant Surveyor',
    titleAr: 'مساعد مساح',
    code: 'ENG-01',
    departmentCode: 'ENG',
    orderIndex: 1,
  },
  {
    title: 'Surveyor',
    titleAr: 'مساح',
    code: 'ENG-02',
    departmentCode: 'ENG',
    orderIndex: 2,
  },
  {
    title: 'Survey Engineer',
    titleAr: 'مهندس مساحة',
    code: 'ENG-03',
    departmentCode: 'ENG',
    orderIndex: 3,
  },

  // الإدارة العامة (ADM) - 4 وظائف
  {
    title: 'Office Officer',
    titleAr: 'إداري',
    code: 'ADM-01',
    departmentCode: 'ADM',
    orderIndex: 1,
    defaultWorkDaysPerCycle: 30,
    defaultLeaveDaysPerCycle: 10,
  },
  {
    title: 'Executive Administrator',
    titleAr: 'مدير تنفيذي إداري',
    code: 'ADM-02',
    departmentCode: 'ADM',
    orderIndex: 2,
  },
  {
    title: 'Admin & HR Manager',
    titleAr: 'مدير الإدارة والموارد البشرية',
    code: 'ADM-03',
    departmentCode: 'ADM',
    orderIndex: 3,
  },
  {
    title: 'Project & Operations Manager',
    titleAr: 'مدير المشاريع والعمليات',
    code: 'ADM-04',
    departmentCode: 'ADM',
    orderIndex: 4,
  },

  // الإدارة العليا (TMG) - 2 وظيفة
  {
    title: 'Chairman & CEO',
    titleAr: 'رئيس مجلس الإدارة والرئيس التنفيذي',
    code: 'TMG-01',
    departmentCode: 'TMG',
    orderIndex: 1,
  },
  {
    title: 'General Manager (GM)',
    titleAr: 'المدير العام',
    code: 'TMG-02',
    departmentCode: 'TMG',
    orderIndex: 2,
  },

  // إدارة المالية والمحاسبة (FIN) - 1 وظيفة
  {
    title: 'Accountant',
    titleAr: 'محاسب',
    code: 'FIN-01',
    departmentCode: 'FIN',
    orderIndex: 1,
  },
]
