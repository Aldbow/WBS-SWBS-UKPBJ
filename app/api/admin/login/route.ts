import { NextRequest, NextResponse } from 'next/server';
import { getAdminById } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Log attempt (without logging the actual password for security)
    console.log(`Login attempt for username: ${username}`);

    // Get admin credentials from Google Sheets
    const admin = await getAdminById(username);
    
    if (!admin) {
      console.log(`Admin with ID ${username} not found in Google Sheets`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Direct password comparison (plain text)
    if (password !== admin.password) {
      console.log(`Incorrect password for admin ${username}`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate simple session token using basic encoding (not JWT)
    // In production, you might want to use proper session management
    const sessionToken = `${admin.id}:${Date.now()}`;
    const encodedToken = Buffer.from(sessionToken).toString('base64');

    console.log(`Successful login for admin: ${username}`);

    return NextResponse.json({
      success: true,
      token: encodedToken, // Return simple encoded token instead of JWT
      username: admin.id,
    });

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
