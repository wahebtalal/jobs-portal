import Link from 'next/link';
import { Job, Category, Location } from '@prisma/client';
import { Lang, t } from '@/lib/i18n';

export function JobCard({ job, lang }: { job: Job & { category: Category; location: Location }, lang: Lang }) {
  return (
    <article className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            <Link href={`/jobs/${job.slug}`} className="hover:text-blue-700">{t(lang, job.titleEn, job.titleAr)}</Link>
          </h3>
          <p className="text-sm text-slate-600">{t(lang, job.companyEn, job.companyAr)}</p>
        </div>
        {!job.published && <span className="badge">Draft</span>}
      </div>
      <p className="mt-3 text-sm text-slate-700 line-clamp-2">{t(lang, job.summaryEn, job.summaryAr)}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="badge">{t(lang, job.category.nameEn, job.category.nameAr)}</span>
        <span className="badge">{t(lang, job.location.nameEn, job.location.nameAr)}</span>
        <span className="badge">{job.jobType.replace('_', ' ')}</span>
      </div>
    </article>
  );
}
