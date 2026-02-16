import { NextResponse } from 'next/server';
import { createAdminSession, isAdminCredentialsValid } from '@/lib/auth';

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get('username') || '');
  const password = String(form.get('password') || '');
  if (!isAdminCredentialsValid(username, password)) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  await createAdminSession();
  return NextResponse.redirect(new URL('/admin', req.url));
}
