import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { listJobs } from '@/lib/queries';
import { getLangFromSearchParam, t } from '@/lib/i18n';

function formatDate(value: Date | string, lang: 'ar' | 'en') {
  const d = new Date(value);
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-YE' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const lang = getLangFromSearchParam(sp.lang);
  const page = Number(sp.page || '1');

  const data = await listJobs({
    search: sp.q,
    categoryId: sp.category,
    locationId: sp.location,
    jobType: sp.type,
    page,
  });

  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.location.findMany({ orderBy: { nameEn: 'asc' } }),
  ]);

  const mkUrl = (p: number) => {
    const params = new URLSearchParams(sp as Record<string, string>);
    params.set('page', String(p));
    return `/jobs?${params.toString()}`;
  };

  return (
    <main className="container-page py-6 space-y-4">
      <section className="card p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-semibold text-amber-600">{data.count} {t(lang, 'Job Active', 'وظيفة متاحة')}</span>
          <span className="text-slate-500">{categories.length} {t(lang, 'Categories', 'فئات')}</span>
          <span className="text-slate-500">{locations.length} {t(lang, 'Cities', 'مدن')}</span>
        </div>

        <form className="mt-4 grid md:grid-cols-5 gap-2" method="GET" action="/jobs">
          <input type="hidden" name="lang" value={lang} />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder={t(lang, 'Search title or organization', 'ابحث بعنوان الوظيفة أو الجهة')}
            className="input md:col-span-2"
          />
          <select name="category" defaultValue={sp.category} className="input">
            <option value="">{t(lang, 'Category', 'الفئة')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{t(lang, c.nameEn, c.nameAr)}</option>
            ))}
          </select>
          <select name="location" defaultValue={sp.location} className="input">
            <option value="">{t(lang, 'Location', 'الموقع')}</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{t(lang, l.nameEn, l.nameAr)}</option>
            ))}
          </select>
          <select name="type" defaultValue={sp.type} className="input">
            <option value="">{t(lang, 'Type', 'النوع')}</option>
            {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'].map((v) => (
              <option key={v} value={v}>{v.replace('_', ' ')}</option>
            ))}
          </select>
          <button className="btn btn-primary md:col-span-5">{t(lang, 'Search', 'بحث')}</button>
        </form>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.slice(0, 8).map((c) => (
            <div key={c.id} className="badge justify-start">
              {t(lang, c.nameEn, c.nameAr)}
            </div>
          ))}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-3 text-start">{t(lang, 'Posted', 'تاريخ النشر')}</th>
                <th className="px-3 py-3 text-start">{t(lang, 'Organization', 'الجهة')}</th>
                <th className="px-3 py-3 text-start">{t(lang, 'Title', 'المسمى')}</th>
                <th className="px-3 py-3 text-start">{t(lang, 'Location', 'الموقع')}</th>
                <th className="px-3 py-3 text-start">{t(lang, 'Deadline', 'آخر موعد')}</th>
                <th className="px-3 py-3 text-start">{t(lang, 'Apply', 'التقديم')}</th>
              </tr>
            </thead>
            <tbody>
              {data.jobs.map((job) => {
                const posted = formatDate(job.publishedAt || job.createdAt, lang);
                const deadline = formatDate(new Date(new Date(job.publishedAt || job.createdAt).getTime() + 1000 * 60 * 60 * 24 * 30), lang);
                const companyName = t(lang, job.companyEn, job.companyAr);
                const title = t(lang, job.titleEn, job.titleAr);
                const location = t(lang, job.location.nameEn, job.location.nameAr);

                return (
                  <tr key={job.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                    <td className="px-3 py-3 whitespace-nowrap text-slate-500">{posted}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold grid place-items-center">
                          {initials(companyName)}
                        </div>
                        <span className="text-slate-700">{companyName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-900">
                      <Link href={`/jobs/${job.slug}`} className="hover:text-blue-700">{title}</Link>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{location}</td>
                    <td className="px-3 py-3 text-rose-500 whitespace-nowrap">{deadline}</td>
                    <td className="px-3 py-3">
                      <a href={job.applyUrl} target="_blank" className="text-blue-700 hover:text-blue-800 font-medium">
                        {t(lang, 'Apply', 'قدّم')}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <Link href={mkUrl(Math.max(1, data.page - 1))} className="btn btn-secondary">{t(lang, 'Prev', 'السابق')}</Link>
        <span className="text-sm muted">{t(lang, 'Page', 'صفحة')} {data.page}/{data.totalPages}</span>
        <Link href={mkUrl(Math.min(data.totalPages, data.page + 1))} className="btn btn-secondary">{t(lang, 'Next', 'التالي')}</Link>
      </div>
    </main>
  );
}
