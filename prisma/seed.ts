import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.job.deleteMany();
  await prisma.category.deleteMany();
  await prisma.location.deleteMany();

  const [it, ngo, finance] = await Promise.all([
    prisma.category.create({ data: { nameEn: 'IT & Software', nameAr: 'تقنية المعلومات والبرمجيات' } }),
    prisma.category.create({ data: { nameEn: 'NGO & Development', nameAr: 'المنظمات والتنمية' } }),
    prisma.category.create({ data: { nameEn: 'Finance & Accounting', nameAr: 'المالية والمحاسبة' } }),
  ]);

  const [sanaa, aden, remote] = await Promise.all([
    prisma.location.create({ data: { nameEn: 'Sana\'a', nameAr: 'صنعاء' } }),
    prisma.location.create({ data: { nameEn: 'Aden', nameAr: 'عدن' } }),
    prisma.location.create({ data: { nameEn: 'Remote', nameAr: 'عن بُعد' } }),
  ]);

  await prisma.job.createMany({
    data: [
      {
        slug: 'senior-frontend-engineer-techbridge',
        titleEn: 'Senior Frontend Engineer', titleAr: 'مهندس واجهات أمامية أول',
        companyEn: 'TechBridge', companyAr: 'تك بريدج',
        summaryEn: 'Build scalable bilingual web apps using modern React stack.',
        summaryAr: 'بناء تطبيقات ويب ثنائية اللغة قابلة للتوسع باستخدام React الحديثة.',
        descriptionEn: 'You will lead frontend architecture, mentor engineers, and deliver accessible interfaces.',
        descriptionAr: 'ستقود هندسة الواجهة الأمامية وتوجّه المهندسين وتقدم واجهات سهلة الوصول.',
        applyUrl: 'https://example.com/apply/frontend', published: true,
        categoryId: it.id, locationId: remote.id, jobType: 'REMOTE',
      },
      {
        slug: 'program-officer-humanity-plus',
        titleEn: 'Program Officer', titleAr: 'مسؤول برامج',
        companyEn: 'Humanity Plus', companyAr: 'هيومانيتي بلس',
        summaryEn: 'Coordinate field projects and donor reporting.',
        summaryAr: 'تنسيق المشاريع الميدانية وتقارير الجهات المانحة.',
        descriptionEn: 'Manage implementation plans, stakeholder communication, and monitoring indicators.',
        descriptionAr: 'إدارة خطط التنفيذ والتواصل مع أصحاب المصلحة ومؤشرات المتابعة.',
        applyUrl: 'https://example.com/apply/program', published: true,
        categoryId: ngo.id, locationId: aden.id, jobType: 'FULL_TIME',
      },
      {
        slug: 'accountant-alnoor-group',
        titleEn: 'Accountant', titleAr: 'محاسب',
        companyEn: 'Alnoor Group', companyAr: 'مجموعة النور',
        summaryEn: 'Handle daily accounting entries and monthly reconciliations.',
        summaryAr: 'إدارة القيود اليومية والتسويات الشهرية.',
        descriptionEn: 'Prepare financial statements, process invoices, and support annual audits.',
        descriptionAr: 'إعداد البيانات المالية ومعالجة الفواتير ودعم المراجعة السنوية.',
        applyUrl: 'https://example.com/apply/accountant', published: false,
        categoryId: finance.id, locationId: sanaa.id, jobType: 'FULL_TIME',
      }
    ]
  });
}

main().finally(() => prisma.$disconnect());
