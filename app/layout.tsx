import './globals.css';
import Link from 'next/link';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Jobs Portal',
  description: 'Bilingual jobs portal',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value === 'ar' ? 'ar' : 'en';
  const isAr = lang === 'ar';
  return (
    <html lang={lang} dir={isAr ? 'rtl' : 'ltr'}>
      <body>
        <header className="border-b bg-white">
          <div className="container-page py-4 flex items-center justify-between gap-3">
            <Link href="/jobs" className="font-bold text-lg text-blue-700">Yemen Talent Hub</Link>
            <div className="flex items-center gap-2">
              <form action="/jobs" method="GET">
                <input type="hidden" name="lang" value={isAr ? 'en' : 'ar'} />
                <button className="btn btn-secondary" type="submit">{isAr ? 'English' : 'العربية'}</button>
              </form>
              <Link className="btn btn-secondary" href="/admin">Admin</Link>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
