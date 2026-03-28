# Development Rules

These are the rules we follow when developing TheFilmProject. Follow them every time — no exceptions.

---

## Branching

- **Always branch off `develop`**, never off `main`
- Branch naming:
  - New feature → `feature/<name>` (e.g. `feature/notifications`)
  - Bug fix → `bugfix/<name>` (e.g. `bugfix/login-error`)
  - Quick fix → `fix/<name>`
- When done and tested → merge back into `develop`
- `main` is production only — only merge `develop` into `main` for a release

---

## TDD — Test Driven Development

Follow TDD strictly for every feature and bug fix:

1. **Write tests first** — unit tests, integration tests, whatever is appropriate
2. **Run tests** — they should all fail (red)
3. **Write the minimum code** to make the tests pass
4. **Run tests again** — they should all pass (green)
5. **Refactor** if needed, keep tests passing

Do not write production code before writing a failing test.

---

## Playwright Integration Tests

Every feature must have Playwright integration tests before it is considered done:

- Tests go in `frontend/tests/`
- Follow the existing pattern: CommonJS (`require`), `test.describe.serial`, same `BASE` constant
- Cover the happy path and key error states
- Run the full test suite before merging to make sure nothing is broken:

```bash
cd frontend
npx playwright test
```

All tests must pass before merging into `develop`.

### Test suites

| File | Purpose |
|---|---|
| `integration.spec.js` | Core user journeys (register → post → connect → notify). Run after any change to existing features. |
| `pre-launch.spec.js` | Pre-launch feature checks (404, ToS, forgot password, email verify, SEO, char counters, image upload). |
| `profile-photo.spec.js` | Profile photo upload and display across the feed. |
| `login-error.spec.js` | Login error handling edge cases. |

When adding a new feature, create a new `<feature-name>.spec.js` file rather than adding to an existing one.

---

## Definition of Done

A feature or fix is only done when:

- [ ] Branched from `develop`
- [ ] Tests written first (TDD)
- [ ] All unit/integration tests passing
- [ ] Playwright tests written and passing
- [ ] Full test suite passing (no regressions)
- [ ] Merged back into `develop`

---

## What NOT to commit

- **Never commit `application.properties`** — it contains secrets (DB credentials, JWT secret, OAuth keys, SMTP passwords)
- Add it to `.gitignore` if not already there
- Use environment variables for all secrets in production (Railway env vars)

---

## Git Hygiene

- Write clear, descriptive commit messages using conventional commits:
  - `feat: add forgot password flow`
  - `fix: resolve comment controller merge conflict`
  - `chore: update dependencies`
  - `test: add playwright tests for notifications`
- One logical change per commit
- Don't commit commented-out code or debug logs
- **Never add `Co-Authored-By` or any AI attribution lines to commit messages** — all commits must appear under the developer's name only

---

## General

- Keep `develop` always in a working, deployable state
- Don't merge broken code into `develop`
- If a feature takes more than one session, keep it on its feature branch until it's fully done and tested
