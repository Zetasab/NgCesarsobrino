# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Custom nginx config with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Angular build output
COPY --from=builder /app/dist/NgCesarsobrino/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
