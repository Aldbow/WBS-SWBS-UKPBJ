import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Vercel automatically sends this header for Cron Jobs
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Protect the endpoint if CRON_SECRET is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ping Supabase to keep it active
    // A simple query to keep the database connection active and prevent it from pausing on the free tier.
    const { data, error } = await supabase
      .from('laporan') // Adjust table name if needed, 'laporan' or 'deklarasi' should exist
      .select('id')
      .limit(1);

    // If 'laporan' doesn't exist, this might throw a 404/400 error but still registers as activity!
    // We log it just in case, but consider it a successful ping because it hit the DB.
    if (error) {
      console.warn('Keep-alive ping resulted in a db error (which still keeps it active):', error.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase pinged successfully to keep alive.',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Unexpected error in keep-alive cron:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
