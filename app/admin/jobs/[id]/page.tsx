import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const { id: idParam } = await params;
  const id = Number(idParam);
  const [job, categories, locations] = await Promise.all([
    prisma.job.findUnique({ where: { id } }),
    prisma.category.findMany(),
    prisma.location.findMany(),
  ]);
  if (!job) notFound();

  return (
    <main className="container-page py-8">
      <div className="card p-6">
        <h1 className="text-xl font-bold mb-4">Edit Job</h1>
        <form action={`/api/admin/jobs/${id}`} method="POST" className="grid md:grid-cols-2 gap-3">
          <input className="input" name="slug" defaultValue={job.slug} required />
          <select className="input" name="jobType" defaultValue={job.jobType}>{['FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','REMOTE'].map(v => <option key={v}>{v}</option>)}</select>
          <input className="input" name="titleEn" defaultValue={job.titleEn} required />
          <input className="input" name="titleAr" defaultValue={job.titleAr} required />
          <input className="input" name="companyEn" defaultValue={job.companyEn} required />
          <input className="input" name="companyAr" defaultValue={job.companyAr} required />
          <input className="input md:col-span-2" name="summaryEn" defaultValue={job.summaryEn} required />
          <input className="input md:col-span-2" name="summaryAr" defaultValue={job.summaryAr} required />
          <textarea className="input md:col-span-2" name="descriptionEn" defaultValue={job.descriptionEn} required />
          <textarea className="input md:col-span-2" name="descriptionAr" defaultValue={job.descriptionAr} required />
          <input className="input md:col-span-2" name="applyUrl" defaultValue={job.applyUrl} required />
          <select className="input" name="categoryId" defaultValue={job.categoryId}>{categories.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}</select>
          <select className="input" name="locationId" defaultValue={job.locationId}>{locations.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}</select>
          <label className="text-sm"><input type="checkbox" name="published" defaultChecked={job.published} /> Published</label>
          <button className="btn btn-primary md:col-span-2">Save Changes</button>
        </form>
      </div>
    </main>
  );
}
