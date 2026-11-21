# AGENTS.md

React (Create React App) web frontend of the PSI suite.

- Use npm (`package-lock.json` is committed): `npm start`, `npm test`, `npm run build`.
- Implement only the requested change; prefer existing component patterns in `src/`.
- Never commit secrets, tokens, or API credentials; API base URLs belong in configuration, not source.
- Verification scaling: docs → diff review; component change → affected tests + `npm run build`.
