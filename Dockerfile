FROM node:18-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Production image ----
FROM node:18-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm install sequelize-cli --no-save

COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/src/config/config.js ./src/config/config.js
COPY --from=base /usr/src/app/src/migrations ./src/migrations
COPY --from=base /usr/src/app/src/seeders ./src/seeders
COPY --from=base /usr/src/app/.sequelizerc ./.sequelizerc
COPY --from=base /usr/src/app/docs ./docs

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/server.js"]
