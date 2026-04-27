import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Delete the admin_token cookie
    cookies().delete('admin_token');
    
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
