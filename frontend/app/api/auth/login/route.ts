// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🚀 API route called');
  
  try {
    // Get form data
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const remember = formData.get('remember') === 'on';

    console.log('📧 Email received:', email);
    console.log('🔑 Password received:', password);
    console.log('💾 Remember:', remember);

    // Validate credentials
    const validEmail = 'admin@kalakosh.com';
    const validPassword = 'admin123';

    // Check credentials
    if (email === validEmail && password === validPassword) {
      console.log('✅ Login successful!');
      
      // Create response
      const response = NextResponse.json({
        success: true,
        message: 'Login successful'
      });

      // Set cookie
      response.cookies.set('adminAuth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 days if remember
      });

      return response;
    } else {
      console.log('❌ Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('💥 API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}