import { cookies } from 'next/headers';

export function verifyToken(): boolean {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return false;
    }

    // Verify simple token format (base64 encoded string with admin ID)
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const [adminId, timestamp] = decodedToken.split(':');
    
    // Basic validation: check if format is correct and timestamp is not too old (8 hours)
    if (!adminId || !timestamp) {
      return false;
    }
    
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    
    if (isNaN(tokenTime)) {
      return false; // Invalid timestamp
    }
    
    if (currentTime - tokenTime > maxAge) {
      return false; // Token expired
    }
    
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}
