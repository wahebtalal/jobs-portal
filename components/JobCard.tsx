import Link from 'next/link';
import { Job, Category, Location } from '@prisma/client';
import { Lang, t } from '@/lib/i18n';

export function JobCard({ job, lang }: { job: Job & { category: Category; location: Location }, lang: Lang }) {
  return (
    <article className="job-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 leading-snug">
            <Link href={`/jobs/${job.slug}`} className="hover:text-blue-700">
              {t(lang, job.titleEn, job.titleAr)}
            </Link>
          </h3>
          <p className="mt-1 text-sm muted">{t(lang, job.companyEn, job.companyAr)}</p>
        </div>
        <span className="badge">{job.jobType.replace('_', ' ')}</span>
      </div>

      <p className="mt-3 text-sm text-slate-700 line-clamp-2">{t(lang, job.summaryEn, job.summaryAr)}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="badge">{t(lang, job.category.nameEn, job.category.nameAr)}</span>
        <span className="badge">{t(lang, job.location.nameEn, job.location.nameAr)}</span>
        {!job.published && <span className="badge">Draft</span>}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <Link href={`/jobs/${job.slug}`} className="text-sm font-medium text-blue-700 hover:text-blue-800">
          {t(lang, 'View details', 'عرض التفاصيل')} ←
        </Link>
      </div>
    </article>
  );
}
