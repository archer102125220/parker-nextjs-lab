# Deployment Guide

This guide covers the deployment process for the parker-nextjs-lab project.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Manual Server Deployment](#manual-server-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- PostgreSQL database available
- Firebase project configured
- Required API keys and credentials
- SSL certificates (for production)

---

## Environment Setup

### Required Environment Variables

Create a `.env.production` file with the following variables:

```env
# App
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# WebRTC (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

---

## Vercel Deployment

### Recommended: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/parker-nextjs-lab)

### Manual Vercel Setup

1. **Import Project**
   ```bash
   vercel link
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required variables from `.env.production`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The project includes `vercel.json` for optimal configuration:

```json
{
  "buildCommand": "yarn build",
  "installCommand": "yarn install",
  "framework": "nextjs",
  "regions": ["hnd1"],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t parker-nextjs-lab .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e FIREBASE_PROJECT_ID="..." \
  parker-nextjs-lab
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=parker
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=parkerlab
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

---

## Manual Server Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Install PM2 for process management
npm install -g pm2
```

### 2. Clone and Build

```bash
# Clone repository
git clone <repository-url> /var/www/parker-nextjs-lab
cd /var/www/parker-nextjs-lab

# Install dependencies
yarn install

# Build for production
yarn build
```

### 3. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'parker-nextjs-lab',
    script: 'yarn',
    args: 'start',
    cwd: '/var/www/parker-nextjs-lab',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Start the application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Configure Nginx

```nginx
# /etc/nginx/sites-available/parker-nextjs-lab
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/parker-nextjs-lab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Run tests
        run: yarn test
      
      - name: Build
        run: yarn build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Post-Deployment Checklist

### Functional Verification

- [ ] Homepage loads correctly
- [ ] Internationalization works (EN/ZH-TW)
- [ ] OAuth login flows work
- [ ] Database connections are stable
- [ ] Firebase messaging works
- [ ] Analytics tracking is active

### Performance Checks

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No JavaScript errors in console

### Security Checks

- [ ] HTTPS is enforced
- [ ] Security headers are set
- [ ] API rate limiting is active
- [ ] Environment variables are not exposed

### Monitoring Setup

- [ ] Error tracking (Sentry/similar)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Log aggregation

---

## Troubleshooting

### Common Issues

#### Build Fails with Memory Error
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

#### Database Connection Issues
- Verify `DATABASE_URL` format
- Check network/firewall rules
- Ensure database server is running

#### Firebase Admin SDK Issues
- Ensure private key is properly escaped with `\n`
- Verify service account permissions

---

## Related Documentation

- [API Documentation](./api-documentation.md)
- [Component Catalog](./component-catalog.zh-tw.md)
- [Environment Setup](../.env.example)
