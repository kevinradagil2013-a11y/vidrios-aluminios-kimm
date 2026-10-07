FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY services/contact/package*.json ./services/contact/

RUN npm ci

COPY . .

RUN npm --workspace services/contact run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3107

EXPOSE 3107

CMD ["npm", "--workspace", "services/contact", "run", "start"]