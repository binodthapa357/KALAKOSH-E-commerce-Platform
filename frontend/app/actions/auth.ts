'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const remember = formData.get('remember') === 'on';

  // Validate credentials
  if (email === 'admin@kalakosh.com' && password === 'admin123') {
    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    if (remember) {
      // Remember for 7 days
      cookies().set('adminAuth', 'true', {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      // Session cookie (expires when browser closes)
      cookies().set('adminAuth', 'true', cookieOptions);
    }

    // Redirect to dashboard
    redirect('/admin');
  } else {
    // Return error - redirect back with error parameter
    redirect('/admin/login?error=Invalid credentials');
  }
}

export async function logout() {
  cookies().delete('adminAuth');
  redirect('/admin/login');
}

export async function checkAuth() {
  const authCookie = cookies().get('adminAuth');
  return !!authCookie;
}