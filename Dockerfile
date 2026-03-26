FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
COPY packages/client/package.json packages/client/
RUN npm ci
COPY tsconfig.base.json ./
COPY packages/shared/ packages/shared/
COPY packages/server/ packages/server/
COPY packages/client/ packages/client/
RUN npx tsc -p packages/shared/tsconfig.json \
 && npx tsc -p packages/server/tsconfig.json \
 && npm run build -w packages/client
RUN mkdir -p packages/server/public \
 && cp -r packages/client/dist/* packages/server/public/

FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
RUN npm ci --omit=dev
COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/packages/server/dist packages/server/dist
COPY --from=build /app/packages/server/public packages/server/public
ENV PORT=8000
EXPOSE 8000
CMD ["node", "packages/server/dist/index.js"]
