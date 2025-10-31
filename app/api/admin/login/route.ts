import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAdminById } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate JWT secret
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get admin credentials from Google Sheets
    const admin = await getAdminById(username);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Direct password comparison (plain text)
    if (password !== admin.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: 'admin' },
      jwtSecret,
      { expiresIn: '8h' }
    );

    return NextResponse.json({
      success: true,
      token,
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
