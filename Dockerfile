# Dockerfile
FROM node:18

# Tạo thư mục app
WORKDIR /app

# Copy package trước (caching layer)
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Mở port
EXPOSE 3000

# Chạy app
CMD ["node", "index.js"]
