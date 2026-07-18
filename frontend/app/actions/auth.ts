'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const remember = formData.get('remember') === 'on';

  // Validate credentials
  if (email === 'admin@kalakosh.com' && password === 'admin123') {
    const cookieStore = await cookies();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    if (remember) {
      // Remember for 7 days
      cookieStore.set('adminAuth', 'true', {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      // Session cookie (expires when browser closes)
      cookieStore.set('adminAuth', 'true', cookieOptions);
    }

    // Redirect to dashboard
    redirect('/admin');
  } else {
    // Return error - redirect back with error parameter
    redirect('/admin/login?error=Invalid credentials');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('adminAuth');
  redirect('/admin/login');
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('adminAuth');
  return !!authCookie;
}