export default {
  "apps/web-app/src/**/*.{ts,tsx}": [
    "pnpm --filter @leonly/web-app exec eslint --fix",
    "pnpm --filter @leonly/web-app exec prettier --write",
    () => "pnpm --filter @leonly/web-app typecheck",
  ],
  "apps/web-app/**/*.{json,css,md}": [
    "pnpm --filter @leonly/web-app exec prettier --write",
  ],
};
