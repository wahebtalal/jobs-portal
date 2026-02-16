import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { listJobs } from '@/lib/queries';
import { JobCard } from '@/components/JobCard';
import { getLangFromSearchParam, t } from '@/lib/i18n';
import { cookies } from 'next/headers';

export default async function JobsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const lang = getLangFromSearchParam(sp.lang);
  const cookieStore = await cookies();
  cookieStore.set('lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
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
    <main className="container-page py-8 space-y-6">
      <section className="card p-4 md:p-6">
        <h1 className="text-2xl font-bold text-slate-900">{t(lang, 'Find your next opportunity', 'ابحث عن فرصتك القادمة')}</h1>
        <form className="mt-4 grid md:grid-cols-5 gap-3" method="GET" action="/jobs">
          <input type="hidden" name="lang" value={lang} />
          <input name="q" defaultValue={sp.q} placeholder={t(lang, 'Search jobs or companies', 'ابحث عن وظيفة أو شركة')} className="input md:col-span-2" />
          <select name="category" defaultValue={sp.category} className="input">
            <option value="">{t(lang, 'All categories', 'كل الأقسام')}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{t(lang, c.nameEn, c.nameAr)}</option>)}
          </select>
          <select name="location" defaultValue={sp.location} className="input">
            <option value="">{t(lang, 'All locations', 'كل المواقع')}</option>
            {locations.map(c => <option key={c.id} value={c.id}>{t(lang, c.nameEn, c.nameAr)}</option>)}
          </select>
          <select name="type" defaultValue={sp.type} className="input">
            <option value="">{t(lang, 'All job types', 'كل أنواع الوظائف')}</option>
            {['FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','REMOTE'].map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
          </select>
          <button className="btn btn-primary md:col-span-5">{t(lang, 'Search', 'بحث')}</button>
        </form>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.jobs.map(job => <JobCard key={job.id} job={job} lang={lang} />)}
      </section>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{data.count} {t(lang, 'jobs found', 'وظيفة')}</p>
        <div className="flex gap-2">
          <Link href={mkUrl(Math.max(1, data.page - 1))} className="btn btn-secondary">{t(lang, 'Previous', 'السابق')}</Link>
          <span className="px-2 py-2 text-sm">{data.page}/{data.totalPages}</span>
          <Link href={mkUrl(Math.min(data.totalPages, data.page + 1))} className="btn btn-secondary">{t(lang, 'Next', 'التالي')}</Link>
        </div>
      </div>
    </main>
  );
}
