import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const entity = String(form.get('entity') || 'job');

  if (entity === 'category') {
    await prisma.category.create({ data: { nameEn: String(form.get('nameEn')), nameAr: String(form.get('nameAr')) } });
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  if (entity === 'location') {
    await prisma.location.create({ data: { nameEn: String(form.get('nameEn')), nameAr: String(form.get('nameAr')) } });
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  if (entity === 'categoryUpdate') {
    await prisma.category.update({ where: { id: Number(form.get('id')) }, data: { nameEn: String(form.get('nameEn')), nameAr: String(form.get('nameAr')) } });
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  if (entity === 'locationUpdate') {
    await prisma.location.update({ where: { id: Number(form.get('id')) }, data: { nameEn: String(form.get('nameEn')), nameAr: String(form.get('nameAr')) } });
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  if (entity === 'delete') {
    await prisma.job.delete({ where: { id: Number(form.get('id')) } });
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  await prisma.job.create({
    data: {
      slug: String(form.get('slug')),
      titleEn: String(form.get('titleEn')),
      titleAr: String(form.get('titleAr')),
      companyEn: String(form.get('companyEn')),
      companyAr: String(form.get('companyAr')),
      summaryEn: String(form.get('summaryEn')),
      summaryAr: String(form.get('summaryAr')),
      descriptionEn: String(form.get('descriptionEn')),
      descriptionAr: String(form.get('descriptionAr')),
      applyUrl: String(form.get('applyUrl')),
      jobType: String(form.get('jobType')) as never,
      categoryId: Number(form.get('categoryId')),
      locationId: Number(form.get('locationId')),
      published: Boolean(form.get('published')),
      publishedAt: new Date(),
    },
  });

  return NextResponse.redirect(new URL('/admin', req.url));
}
