import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: idParam } = await params;
  const id = Number(idParam);
  const form = await req.formData();

  await prisma.job.update({
    where: { id },
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
    },
  });

  return NextResponse.redirect(new URL('/admin', req.url));
}
