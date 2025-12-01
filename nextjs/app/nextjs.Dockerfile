FROM node:24-slim

# Đặt thư mục làm việc
WORKDIR /app

# Cài curl
RUN apt-get update && apt-get install -y curl procps && npm install -g pm2 && rm -rf /var/lib/apt/lists/*

# Copy package.json và package-lock.json để cài dependencies
COPY package*.json ./

# Cài dependencies (bao gồm devDependencies vì cần nodemon)
RUN npm ci

# Mở cổng 3000 (NEXTJS config)
EXPOSE 3000

# Chạy nodemon
CMD ["npm", "run", "dev"]