import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id: idParam } = await params;
  const id = Number(idParam);
  const current = await prisma.job.findUnique({ where: { id } });
  if (!current) return NextResponse.redirect(new URL('/admin', req.url));
  await prisma.job.update({ where: { id }, data: { published: !current.published, publishedAt: new Date() } });
  return NextResponse.redirect(new URL('/admin', req.url));
}
