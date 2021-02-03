npx pnpm install -r --store=node_modules/.pnpm-store || echo skiping pnpm install
cd packages/website
npm run docs:build

