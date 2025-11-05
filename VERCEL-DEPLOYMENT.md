# Deployment to Vercel

This project is ready to be deployed on Vercel. Here are the steps to deploy:

## Automatic Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel will automatically detect this is a Next.js project and configure the build settings
5. Add your environment variables in the Environment Variables section
6. Click "Deploy"

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
SHEET_ID_LAPORAN=your-laporan-sheet-id
SHEET_ID_DEKLARASI=your-deklarasi-sheet-id
SHEET_ID_ADMIN=your-admin-sheet-id
DRIVE_FOLDER_ID=your-drive-folder-id
JWT_SECRET=your-super-secret-jwt-token-string-at-least-32-characters-long
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

## Manual Deployment with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create a build:
```bash
npm run build
```

3. Deploy:
```bash
vercel
```

## Notes

- The project uses Next.js 14 with the App Router
- File uploads are stored in the `storage` directory which will be created upon first use
- Admin authentication uses a simple token system (consider using more secure methods in production)
- The application integrates with Google Sheets for data storage and Google Drive for file storage

## Runtime Configuration

All API routes that require Node.js runtime are properly configured in the `vercel.json` file.