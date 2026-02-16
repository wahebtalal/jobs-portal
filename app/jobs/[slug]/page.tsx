import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getCurrentLang, t } from '@/lib/i18n';

export default async function JobDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({
    where: { slug },
    include: { category: true, location: true },
  });
  if (!job || !job.published) notFound();
  const lang = await getCurrentLang();
  return (
    <main className="container-page py-8">
      <article className="card p-6 md:p-8 space-y-4">
        <h1 className="text-2xl font-bold">{t(lang, job.titleEn, job.titleAr)}</h1>
        <p className="text-slate-600">{t(lang, job.companyEn, job.companyAr)}</p>
        <div className="flex flex-wrap gap-2">
          <span className="badge">{t(lang, job.category.nameEn, job.category.nameAr)}</span>
          <span className="badge">{t(lang, job.location.nameEn, job.location.nameAr)}</span>
          <span className="badge">{job.jobType.replace('_', ' ')}</span>
        </div>
        <p className="text-slate-700 leading-7">{t(lang, job.descriptionEn, job.descriptionAr)}</p>
        <a href={job.applyUrl} target="_blank" className="btn btn-primary">{t(lang, 'Apply Externally', 'التقديم عبر رابط خارجي')}</a>
      </article>
    </main>
  );
}
