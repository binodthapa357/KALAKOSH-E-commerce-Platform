import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🔴 Logout API called');
  
  try {
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });

    // Delete the cookie by setting it to expire immediately
    response.cookies.set('adminAuth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Expire immediately
      maxAge: 0, // Remove immediately
    });

    console.log('✅ Auth cookie deleted');
    
    return response;
  } catch (error) {
    console.error('💥 Logout API error:', error);
    return NextResponse.json(
      { error: 'Logout failed', details: String(error) },
      { status: 500 }
    );
  }
}