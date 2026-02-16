import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  const [jobs, categories, locations] = await Promise.all([
    prisma.job.findMany({ include: { category: true, location: true }, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { nameEn: 'asc' } }),
    prisma.location.findMany({ orderBy: { nameEn: 'asc' } }),
  ]);

  return (
    <main className="container-page py-8 space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <form action="/api/admin/logout" method="POST"><button className="btn btn-secondary">Logout</button></form></div>
      <section className="card p-4 md:p-6">
        <h2 className="font-semibold mb-4">Create Job</h2>
        <form action="/api/admin/jobs" method="POST" className="grid md:grid-cols-2 gap-3">
          <input className="input" name="slug" placeholder="slug" required />
          <select className="input" name="jobType" required>{['FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','REMOTE'].map(v => <option key={v}>{v}</option>)}</select>
          <input className="input" name="titleEn" placeholder="Title EN" required />
          <input className="input" name="titleAr" placeholder="Title AR" required />
          <input className="input" name="companyEn" placeholder="Company EN" required />
          <input className="input" name="companyAr" placeholder="Company AR" required />
          <input className="input md:col-span-2" name="summaryEn" placeholder="Summary EN" required />
          <input className="input md:col-span-2" name="summaryAr" placeholder="Summary AR" required />
          <textarea className="input md:col-span-2" name="descriptionEn" placeholder="Description EN" required />
          <textarea className="input md:col-span-2" name="descriptionAr" placeholder="Description AR" required />
          <input className="input md:col-span-2" name="applyUrl" placeholder="External Apply URL" required />
          <select className="input" name="categoryId" required>{categories.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}</select>
          <select className="input" name="locationId" required>{locations.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}</select>
          <label className="text-sm"><input type="checkbox" name="published" defaultChecked /> Published</label>
          <button className="btn btn-primary md:col-span-2">Create Job</button>
        </form>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold">Categories</h3>
          <form className="flex gap-2" action="/api/admin/jobs" method="POST">
            <input type="hidden" name="entity" value="category" />
            <input className="input" name="nameEn" placeholder="Name EN" required />
            <input className="input" name="nameAr" placeholder="Name AR" required />
            <button className="btn btn-secondary">Add</button>
          </form>
          {categories.map(c => <form key={c.id} action="/api/admin/jobs" method="POST" className="flex gap-2"><input type="hidden" name="entity" value="categoryUpdate" /><input type="hidden" name="id" value={c.id} /><input className="input" name="nameEn" defaultValue={c.nameEn} /><input className="input" name="nameAr" defaultValue={c.nameAr} /><button className="btn btn-secondary">Save</button></form>)}
        </div>
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold">Locations</h3>
          <form className="flex gap-2" action="/api/admin/jobs" method="POST">
            <input type="hidden" name="entity" value="location" />
            <input className="input" name="nameEn" placeholder="Name EN" required />
            <input className="input" name="nameAr" placeholder="Name AR" required />
            <button className="btn btn-secondary">Add</button>
          </form>
          {locations.map(c => <form key={c.id} action="/api/admin/jobs" method="POST" className="flex gap-2"><input type="hidden" name="entity" value="locationUpdate" /><input type="hidden" name="id" value={c.id} /><input className="input" name="nameEn" defaultValue={c.nameEn} /><input className="input" name="nameAr" defaultValue={c.nameAr} /><button className="btn btn-secondary">Save</button></form>)}
        </div>
      </section>

      <section className="card p-4 overflow-x-auto">
        <h2 className="font-semibold mb-3">Jobs</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b"><th>Title</th><th>Company</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{jobs.map(j => (
            <tr key={j.id} className="border-b">
              <td className="py-2">{j.titleEn}</td>
              <td>{j.companyEn}</td>
              <td>{j.published ? 'Published' : 'Draft'}</td>
              <td className="py-2 flex gap-2">
                <form action={`/api/admin/jobs/${j.id}/toggle`} method="POST"><button className="btn btn-secondary">{j.published ? 'Unpublish' : 'Publish'}</button></form>
                <Link href={`/admin/jobs/${j.id}`} className="btn btn-secondary">Edit</Link>
                <form action="/api/admin/jobs" method="POST"><input type="hidden" name="entity" value="delete" /><input type="hidden" name="id" value={j.id} /><button className="btn btn-secondary">Delete</button></form>
                <Link href={`/jobs/${j.slug}`} className="btn btn-secondary">View</Link>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </main>
  );
}
