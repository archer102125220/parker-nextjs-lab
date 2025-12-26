# 部署指南

本指南涵蓋 parker-nextjs-lab 專案的部署流程。

---

## 📋 目錄

- [前置需求](#前置需求)
- [環境設定](#環境設定)
- [Vercel 部署](#vercel-部署)
- [Docker 部署](#docker-部署)
- [手動伺服器部署](#手動伺服器部署)
- [CI/CD 流水線](#cicd-流水線)
- [部署後檢查清單](#部署後檢查清單)

---

## 前置需求

部署前請確保具備：

- Node.js 18+ 已安裝
- PostgreSQL 資料庫可用
- Firebase 專案已配置
- 所需的 API 金鑰和憑證
- SSL 憑證（用於生產環境）

---

## 環境設定

### 必要的環境變數

建立 `.env.production` 檔案，包含以下變數：

```env
# 應用程式
NEXT_PUBLIC_APP_URL=https://your-domain.com

# 資料庫
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# OAuth 提供者
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret

# 分析工具
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# WebRTC (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

---

## Vercel 部署

### 推薦：一鍵部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/parker-nextjs-lab)

### 手動 Vercel 設定

1. **連結專案**
   ```bash
   vercel link
   ```

2. **配置環境變數**
   - 前往 Vercel Dashboard → Project Settings → Environment Variables
   - 新增 `.env.production` 中的所有變數

3. **部署**
   ```bash
   vercel --prod
   ```

### Vercel 配置

專案包含 `vercel.json` 以進行最佳配置：

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

## Docker 部署

### 建置 Docker 映像

```bash
# 建置映像
docker build -t parker-nextjs-lab .

# 執行容器
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

執行：
```bash
docker-compose up -d
```

---

## 手動伺服器部署

### 1. 伺服器設定

```bash
# 更新系統
sudo apt update && sudo apt upgrade -y

# 安裝 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安裝 Yarn
npm install -g yarn

# 安裝 PM2 進行程序管理
npm install -g pm2
```

### 2. 複製並建置

```bash
# 複製專案
git clone <repository-url> /var/www/parker-nextjs-lab
cd /var/www/parker-nextjs-lab

# 安裝依賴
yarn install

# 建置生產版本
yarn build
```

### 3. 配置 PM2

建立 `ecosystem.config.js`：

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

啟動應用程式：
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. 配置 Nginx

```nginx
# /etc/nginx/sites-available/parker-nextjs-lab
server {
    listen 80;
    server_name your-domain.com;
    
    # 重新導向至 HTTPS
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

啟用並重啟：
```bash
sudo ln -s /etc/nginx/sites-available/parker-nextjs-lab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## CI/CD 流水線

### GitHub Actions

建立 `.github/workflows/deploy.yml`：

```yaml
name: 部署至生產環境

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: 設定 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: 安裝依賴
        run: yarn install --frozen-lockfile
      
      - name: 執行測試
        run: yarn test
      
      - name: 建置
        run: yarn build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: 部署至 Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 部署後檢查清單

### 功能驗證

- [ ] 首頁正確載入
- [ ] 國際化運作正常（EN/ZH-TW）
- [ ] OAuth 登入流程正常
- [ ] 資料庫連線穩定
- [ ] Firebase 訊息功能正常
- [ ] 分析追蹤已啟用

### 效能檢查

- [ ] Lighthouse 分數 > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] 控制台無 JavaScript 錯誤

### 安全檢查

- [ ] HTTPS 已強制
- [ ] 安全標頭已設定
- [ ] API 速率限制已啟用
- [ ] 環境變數未暴露

### 監控設定

- [ ] 錯誤追蹤（Sentry 或類似工具）
- [ ] 運行時間監控
- [ ] 效能監控
- [ ] 日誌彙整

---

## 疑難排解

### 常見問題

#### 記憶體錯誤導致建置失敗
```bash
# 增加 Node.js 記憶體
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

#### 資料庫連線問題
- 驗證 `DATABASE_URL` 格式
- 檢查網路/防火牆規則
- 確保資料庫伺服器運行中

#### Firebase Admin SDK 問題
- 確保私鑰正確使用 `\n` 跳脫
- 驗證服務帳戶權限

---

## 相關文件

- [API 文件](./api-documentation.zh-tw.md)
- [組件目錄](./component-catalog.zh-tw.md)
- [環境設定](../../.env.example)
