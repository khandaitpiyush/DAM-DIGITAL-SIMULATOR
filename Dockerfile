# Production multi-stage Docker build for DAM-DIGITAL-SIMULATOR
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
