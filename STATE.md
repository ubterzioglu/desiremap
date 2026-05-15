# STATE

## 2026-05-15 11:22 +0200

- Scope: public frontend deployment unblock for Coolify commit `e7b9702` follow-up.
- Fixed strict optional typing across login props, search params, admin/operator payloads, reservation notes, public fallback mapping, layout helpers, UI wrappers, toast actions, auth normalization, SEO city hints, and proxy locale guards.
- Added missing `eslint-config-prettier` dev dependency used by `eslint.config.mjs`.
- Bumped `package.json` version to `0.2.1` and added `CHANGELOG.md` release entry.
- Verification: `bun run typecheck` passed; `bun run lint` passed with 2 pre-existing complexity warnings; `bun run build` passed.
