FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/

RUN npm ci

COPY . .

ARG VITE_CONTACT_API_URL=http://localhost:3107
ENV VITE_CONTACT_API_URL=$VITE_CONTACT_API_URL

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]