import { google } from 'googleapis';

// Get admin credentials from Google Sheets
export async function getAdminCredentials() {
  try {
    // Google Sheets configuration - read during function execution
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const ADMIN_SHEET_ID = process.env.SHEET_ID_ADMIN || process.env.SHEET_ID_LAPORAN; // Use dedicated admin sheet if available, otherwise fallback

    // Validate required environment variables
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !ADMIN_SHEET_ID) {
      console.error('Missing required environment variables for Google Sheets API.');
      console.error(`GOOGLE_SERVICE_ACCOUNT_EMAIL: ${!!GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
      console.error(`GOOGLE_PRIVATE_KEY: ${!!GOOGLE_PRIVATE_KEY}`);
      console.error(`ADMIN_SHEET_ID: ${!!ADMIN_SHEET_ID}`);
      throw new Error(
        'Missing required environment variables for Google Sheets API. Please check your environment variables.'
      );
    }

    // Create JWT client for authentication (only when needed)
    const jwtClient = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      undefined,
      GOOGLE_PRIVATE_KEY!,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({
      version: 'v4',
      auth: jwtClient,
    });

    // Read from the 'Admin' sheet tab
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: ADMIN_SHEET_ID,
      range: 'Admin!A:B', // Read columns A (ID) and B (Password)
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.warn('No data found in Admin sheet');
      return [];
    }

    // Assuming the first row contains headers, so we start from index 1
    // Row format: [ID, Password]
    const adminCredentials = rows.slice(1).map((row, index) => {
      if (!row || row.length < 2) {
        console.warn(`Skipping row ${index + 2} due to insufficient data:`, row);
        return null;
      }
      return {
        id: row[0]?.toString() || '',
        password: row[1]?.toString() || '',
      };
    }).filter((cred): cred is { id: string, password: string } => cred !== null);

    console.log(`Loaded ${adminCredentials.length} admin credentials from Google Sheets`);
    return adminCredentials;
  } catch (error) {
    console.error('Error fetching admin credentials from Google Sheets:', error);
    throw new Error('Failed to fetch admin credentials from Google Sheets');
  }
}

// Get admin by ID from Google Sheets
export async function getAdminById(adminId: string) {
  try {
    console.log(`Looking up admin by ID: ${adminId}`);
    const adminCredentials = await getAdminCredentials();
    const admin = adminCredentials.find(admin => admin.id === adminId);
    console.log(`Admin lookup result for ID ${adminId}: ${admin ? 'found' : 'not found'}`);
    return admin;
  } catch (error) {
    console.error('Error fetching admin by ID from Google Sheets:', error);
    throw new Error('Failed to fetch admin credentials from Google Sheets');
  }
}