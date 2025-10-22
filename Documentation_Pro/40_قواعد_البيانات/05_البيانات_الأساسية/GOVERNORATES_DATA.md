# 🇪🇬 بيانات المحافظات المصرية (27 محافظة)

## القائمة الكاملة للمحافظات:

```json
[
  {
    "name": "القاهرة",
    "nameEn": "Cairo",
    "code": "CAI"
  },
  {
    "name": "الجيزة",
    "nameEn": "Giza",
    "code": "GIZ"
  },
  {
    "name": "الإسكندرية",
    "nameEn": "Alexandria",
    "code": "ALX"
  },
  {
    "name": "الدقهلية",
    "nameEn": "Dakahlia",
    "code": "DK"
  },
  {
    "name": "البحيرة",
    "nameEn": "Beheira",
    "code": "BH"
  },
  {
    "name": "الشرقية",
    "nameEn": "Sharqia",
    "code": "SHR"
  },
  {
    "name": "القليوبية",
    "nameEn": "Qalyubia",
    "code": "QB"
  },
  {
    "name": "كفر الشيخ",
    "nameEn": "Kafr El Sheikh",
    "code": "KFS"
  },
  {
    "name": "الغربية",
    "nameEn": "Gharbia",
    "code": "GH"
  },
  {
    "name": "المنوفية",
    "nameEn": "Monufia",
    "code": "MN"
  },
  {
    "name": "دمياط",
    "nameEn": "Damietta",
    "code": "DT"
  },
  {
    "name": "بورسعيد",
    "nameEn": "Port Said",
    "code": "PTS"
  },
  {
    "name": "الإسماعيلية",
    "nameEn": "Ismailia",
    "code": "IS"
  },
  {
    "name": "السويس",
    "nameEn": "Suez",
    "code": "SUZ"
  },
  {
    "name": "المنيا",
    "nameEn": "Minya",
    "code": "MN"
  },
  {
    "name": "بني سويف",
    "nameEn": "Beni Suef",
    "code": "BNS"
  },
  {
    "name": "الفيوم",
    "nameEn": "Faiyum",
    "code": "FYM"
  },
  {
    "name": "أسيوط",
    "nameEn": "Assiut",
    "code": "AST"
  },
  {
    "name": "سوهاج",
    "nameEn": "Sohag",
    "code": "SHG"
  },
  {
    "name": "قنا",
    "nameEn": "Qena",
    "code": "KN"
  },
  {
    "name": "أسوان",
    "nameEn": "Aswan",
    "code": "ASN"
  },
  {
    "name": "الأقصر",
    "nameEn": "Luxor",
    "code": "LXR"
  },
  {
    "name": "البحر الأحمر",
    "nameEn": "Red Sea",
    "code": "BA"
  },
  {
    "name": "الوادي الجديد",
    "nameEn": "New Valley",
    "code": "WAD"
  },
  {
    "name": "مطروح",
    "nameEn": "Matrouh",
    "code": "MT"
  },
  {
    "name": "شمال سيناء",
    "nameEn": "North Sinai",
    "code": "SIN"
  },
  {
    "name": "جنوب سيناء",
    "nameEn": "South Sinai",
    "code": "JS"
  }
]
```

## سكريبت seed للمحافظات:

```typescript
const governorates = [
  { name: 'القاهرة', nameEn: 'Cairo', code: 'CAI', orderIndex: 1 },
  { name: 'الجيزة', nameEn: 'Giza', code: 'GIZ', orderIndex: 2 },
  { name: 'الإسكندرية', nameEn: 'Alexandria', code: 'ALX', orderIndex: 3 },
  { name: 'الدقهلية', nameEn: 'Dakahlia', code: 'DK', orderIndex: 4 },
  { name: 'البحيرة', nameEn: 'Beheira', code: 'BH', orderIndex: 5 },
  { name: 'الشرقية', nameEn: 'Sharqia', code: 'SHR', orderIndex: 6 },
  { name: 'القليوبية', nameEn: 'Qalyubia', code: 'QB', orderIndex: 7 },
  { name: 'كفر الشيخ', nameEn: 'Kafr El Sheikh', code: 'KFS', orderIndex: 8 },
  { name: 'الغربية', nameEn: 'Gharbia', code: 'GH', orderIndex: 9 },
  { name: 'المنوفية', nameEn: 'Monufia', code: 'MN', orderIndex: 10 },
  { name: 'دمياط', nameEn: 'Damietta', code: 'DT', orderIndex: 11 },
  { name: 'بورسعيد', nameEn: 'Port Said', code: 'PTS', orderIndex: 12 },
  { name: 'الإسماعيلية', nameEn: 'Ismailia', code: 'IS', orderIndex: 13 },
  { name: 'السويس', nameEn: 'Suez', code: 'SUZ', orderIndex: 14 },
  { name: 'المنيا', nameEn: 'Minya', code: 'MNA', orderIndex: 15 },
  { name: 'بني سويف', nameEn: 'Beni Suef', code: 'BNS', orderIndex: 16 },
  { name: 'الفيوم', nameEn: 'Faiyum', code: 'FYM', orderIndex: 17 },
  { name: 'أسيوط', nameEn: 'Assiut', code: 'AST', orderIndex: 18 },
  { name: 'سوهاج', nameEn: 'Sohag', code: 'SHG', orderIndex: 19 },
  { name: 'قنا', nameEn: 'Qena', code: 'KN', orderIndex: 20 },
  { name: 'أسوان', nameEn: 'Aswan', code: 'ASN', orderIndex: 21 },
  { name: 'الأقصر', nameEn: 'Luxor', code: 'LXR', orderIndex: 22 },
  { name: 'البحر الأحمر', nameEn: 'Red Sea', code: 'BA', orderIndex: 23 },
  { name: 'الوادي الجديد', nameEn: 'New Valley', code: 'WAD', orderIndex: 24 },
  { name: 'مطروح', nameEn: 'Matrouh', code: 'MT', orderIndex: 25 },
  { name: 'شمال سيناء', nameEn: 'North Sinai', code: 'SIN', orderIndex: 26 },
  { name: 'جنوب سيناء', nameEn: 'South Sinai', code: 'JS', orderIndex: 27 },
]

for (const gov of governorates) {
  await prisma.governorate.upsert({
    where: { code: gov.code },
    update: {},
    create: gov
  })
}
```
