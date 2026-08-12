# EPIK DUCK

EPIK DUCK is a Vite-powered React site for the $EPIK community, lore, ecosystem links, and illustrative vault calculators.

## Local development

```bash
npm ci
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Verification

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

The browser smoke test needs a local Chrome or Chromium binary. Set `CHROME_PATH` when it is not installed in a standard location.

## Deployment

The project is configured for a root-hosted Vite deployment such as Vercel. The Vite base path remains `/`, so the deployment should serve the built `dist` directory at the domain root. Run the production build before publishing and keep the Solana price endpoint available to the deployed browser client.

Vault reward and exit values are explicitly illustrative UI estimates. Any production staking integration must source current terms from the live vault rather than treating the displayed defaults as on-chain facts.
