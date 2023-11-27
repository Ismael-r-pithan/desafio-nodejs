FROM node:18.17 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npx prisma generate
RUN npx prisma migrate

FROM node:18.17-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate
RUN npm install --only=production

CMD [  "npm", "run", "start:prod" ]
