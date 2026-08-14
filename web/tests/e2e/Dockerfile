FROM mcr.microsoft.com/playwright:v1.49.1-noble
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY playwright.config.ts ./
COPY tests/e2e ./tests/e2e
CMD ["npx", "playwright", "test"]
