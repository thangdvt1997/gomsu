FROM mcr.microsoft.com/playwright:v1.55.1-noble
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY playwright.config.ts ./
COPY tests/e2e ./tests/e2e
CMD ["npx", "playwright", "test"]
