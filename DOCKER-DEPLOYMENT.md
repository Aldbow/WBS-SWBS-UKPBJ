# Docker Deployment for SWBS-COI-PBJ

This guide will help you deploy the SWBS-COI-PBJ application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (if using docker-compose)
- Your environment variables configured (see .env.local.example) - Note: These are only required at runtime, not during the build process

## Quick Start

### 1. Build and run using Docker Compose (recommended)

```bash
# Clone or navigate to your project directory
cd swbs-coi-pbj

# Create .env file based on the example
cp .env.local.example .env

# Edit the .env file with your actual environment variables
# (see Environment Variables section below)

# Build and start the application
docker-compose up --build
```

The application will be available at `http://localhost:3000` or from other computers using your machine's IP address.

### 2. Alternative: Build and run using Docker commands

```bash
# Build the image
docker build -t swbs-coi-pbj .

# Run the container
docker run -p 3000:3000 -e HOST=0.0.0.0 -e NEXT_PUBLIC_APP_URL=http://0.0.0.0:3000 swbs-coi-pbj
```

### 2. Alternative: Build and run using Docker commands

```bash
# Build the image
docker build -t swbs-coi-pbj .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_APP_URL=http://localhost:3000 swbs-coi-pbj
```

## Environment Variables

You must configure the following environment variables for production:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
SHEET_ID_LAPORAN=your-laporan-sheet-id
SHEET_ID_DEKLARASI=your-deklarasi-sheet-id
SHEET_ID_ADMIN=your-admin-sheet-id
DRIVE_FOLDER_ID=your-drive-folder-id
JWT_SECRET=your-super-secret-jwt-token-string-at-least-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Setting up Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env
```

2. Edit the `.env` file and add your actual values

3. Uncomment the `env_file` line in `docker-compose.yml` to use the environment variables:
```yaml
# In docker-compose.yml:
services:
  app:
    # ... other configurations
    env_file:
      - .env
```

## File Uploads and Storage

The Docker setup includes a volume mount for file storage:
- `/app/storage` in the container is mapped to `./storage` on the host
- This ensures uploaded files persist between container restarts
- The application stores report uploads in the `storage/report_uploads` directory

## Accessing the Application

After running the Docker Compose command:

1. The application will be available at `http://localhost:3000`
2. For local network access, use your machine's IP address instead of localhost:
   - Find your IP address: `ipconfig` (Windows) or `ifconfig` (Linux/Mac)
   - Access via: `http://[YOUR_IP_ADDRESS]:3000`
3. For external access, you may need to configure port forwarding on your router

## Configuration Options

### Nginx Reverse Proxy (Optional)

For production use, uncomment the Nginx configuration in `docker-compose.yml` and create an appropriate `nginx.conf` file. This allows:

- SSL/TLS termination
- Better performance
- Static file serving
- Multiple domain support

### Port Configuration

To change the exposed port, modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Change 8080 to your desired external port
```

## Production Considerations

1. **Networking**:
   - For production, consider using a reverse proxy (Nginx) on ports 80/443
   - Configure proper DNS records if using domain names
   - The Docker image is configured to bind to 0.0.0.0 by default to allow external connections
   - Monitor for port conflicts with other services

2. **Security**:
   - Use strong passwords and secure JWT secrets
   - Consider using HTTPS (with SSL certificates)
   - Regularly update the base Docker image
   - Implement rate limiting and security headers

3. **Storage**:
   - Regularly backup the storage directory
   - Monitor disk usage for file uploads
   - Consider using external storage for production environments

4. **Environment**:
   - Never commit .env files to version control
   - Use Docker secrets for sensitive information in production

## Host Configuration Note

The Docker image is preconfigured to:
- Bind to all network interfaces (0.0.0.0) to accept external connections
- Use PORT=3000 and HOST=0.0.0.0 environment variables
- Allow connections from any network location on port 3000

## Networking and External Access

### Local Network Access
To access the application from other devices on your local network:

1. Ensure the Docker container is running with `NEXT_PUBLIC_APP_URL=http://0.0.0.0:3000`
2. Find your host machine's IP address:
   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig` or `ip addr`
3. Access via: `http://[YOUR_MACHINE_IP]:3000`

### Troubleshooting Network Access

If you still can't access from other computers:

1. **Check Windows Firewall**:
   - Open Windows Defender Firewall
   - Create an inbound rule to allow port 3000
   - Or temporarily disable firewall to test

2. **Verify Docker port mapping**:
   - Run `docker ps` to confirm the container is running
   - Check that port 3000 is correctly mapped

3. **Test connectivity**:
   - From another computer, try pinging your host machine IP address
   - Use `telnet [HOST_IP] 3000` to test if the port is accessible

### External Access
For external access over the internet:

1. Configure port forwarding on your router to forward external port 3000 to your machine's port 3000
2. Update `NEXT_PUBLIC_APP_URL` to reflect your public IP or domain
3. Consider using a reverse proxy with SSL for security
4. Be aware of ISP restrictions on residential connections

### Using with a Domain Name
If you have a domain name, you can use it with Nginx by:
1. Pointing your domain to your server's IP address
2. Configuring SSL certificates
3. Updating the Nginx configuration

## Troubleshooting

### Container won't start
- Check the logs: `docker-compose logs app`
- Verify environment variables are correctly set
- Ensure required ports are available

### File uploads not working
- Verify the storage volume is mounted correctly
- Check file permissions in the storage directory
- Ensure the storage directory exists and is writable

### Application not accessible
- Confirm Docker is running
- Check if the correct port is exposed
- Verify firewall settings allow traffic on port 3000