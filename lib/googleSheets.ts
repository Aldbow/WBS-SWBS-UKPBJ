import { google } from 'googleapis';

const getAuthClient = () => {
  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!client_email || !private_key) {
    console.error('Missing Google Service Account credentials');
    console.error(`GOOGLE_SERVICE_ACCOUNT_EMAIL: ${!!client_email}`);
    console.error(`GOOGLE_PRIVATE_KEY: ${!!private_key}`);
    throw new Error('Missing Google Service Account credentials');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email,
      private_key,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
};

export const appendToSheet = async (sheetId: string, range: string, values: any[]) => {
  try {
    console.log(`Appending data to sheet ${sheetId}, range ${range}`);
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });

    console.log('Data appended successfully');
    return response.data;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
};

export const getSheetData = async (sheetId: string, range: string) => {
  try {
    console.log(`Fetching data from sheet ${sheetId}, range ${range}`);
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const values = response.data.values || [];
    console.log(`Fetched ${values.length} rows from sheet`);
    return values;
  } catch (error) {
    console.error('Error getting sheet data:', error);
    throw error;
  }
};

export const updateSheetData = async (sheetId: string, range: string, values: any[][]) => {
  try {
    console.log(`UPDATING (not appending) data in sheet ${sheetId}, range ${range}`);
    console.log(`Values to update:`, values);
    console.log('Method being called: spreadsheets.values.update');
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('Sheet data updated successfully', response);
    return response.data;
  } catch (error) {
    console.error('Error updating sheet data:', error);
    throw error;
  }
};

export const deleteSheetRow = async (sheetId: string, rowIndex: number) => {
  try {
    console.log(`Deleting row ${rowIndex} from sheet ${sheetId}`);
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming the first sheet
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    console.log('Row deleted successfully');
    return response.data;
  } catch (error) {
    console.error('Error deleting row:', error);
    throw error;
  }
};
