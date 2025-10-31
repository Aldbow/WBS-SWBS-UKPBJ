import { google } from 'googleapis';

// Google Sheets configuration
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const ADMIN_SHEET_ID = process.env.SHEET_ID_ADMIN || process.env.SHEET_ID_LAPORAN; // Use dedicated admin sheet if available, otherwise fallback

if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !ADMIN_SHEET_ID) {
  throw new Error(
    'Missing required environment variables for Google Sheets API. Please check your .env.local file.'
  );
}

// Create JWT client for authentication
const jwtClient = new google.auth.JWT(
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  undefined,
  GOOGLE_PRIVATE_KEY,
  ['https://www.googleapis.com/auth/spreadsheets']
);

// Get admin credentials from Google Sheets
export async function getAdminCredentials() {
  try {
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
      throw new Error('No admin credentials found in the Admin sheet');
    }

    // Assuming the first row contains headers, so we start from index 1
    // Row format: [ID, Password]
    const adminCredentials = rows.slice(1).map((row) => ({
      id: row[0]?.toString() || '',
      password: row[1]?.toString() || '',
    }));

    return adminCredentials;
  } catch (error) {
    console.error('Error fetching admin credentials from Google Sheets:', error);
    throw new Error('Failed to fetch admin credentials from Google Sheets');
  }
}

// Get admin by ID from Google Sheets
export async function getAdminById(adminId: string) {
  try {
    const adminCredentials = await getAdminCredentials();
    return adminCredentials.find(admin => admin.id === adminId);
  } catch (error) {
    console.error('Error fetching admin by ID from Google Sheets:', error);
    throw new Error('Failed to fetch admin credentials from Google Sheets');
  }
}