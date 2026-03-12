# Publishing @anyway-sh/node-server-sdk to npm

## Prerequisites

1. **npm account** — create at https://www.npmjs.com/signup
2. **@anyway-sh org membership** — you must be a member of the `anyway-sh` npm org with publish permissions
3. **npm token** — generate at https://www.npmjs.com/settings/~/tokens (choose "Automation" type for CI, or "Publish" for local use)

## Manual Publishing

### 1. Login to npm

```bash
npm login
```

### 2. Bump version

```bash
cd packages/anyway-sdk
npm version patch   # 0.22.8 → 0.22.9
# or: npm version minor  # 0.22.8 → 0.23.0
# or: npm version major  # 0.22.8 → 1.0.0
```

### 3. Build and publish

The SDK depends on `@traceloop/*` packages via `workspace:*` links, which npm rejects. The scripts automatically convert these to version pins, build/publish, then restore `package.json`.

**Option A: Build only (inspect before publishing)**

```bash
./scripts/build-release.sh
```

This builds the SDK and automatically restores `package.json` afterward.

**Option B: Build and publish in one step**

```bash
./scripts/publish-release.sh
```

Both scripts back up `package.json` before modifying it and restore it automatically when done (even on failure).

### 4. Verify

```bash
npm info @anyway-sh/node-server-sdk
```

Test installation in a fresh project:

```bash
mkdir /tmp/test-anyway && cd /tmp/test-anyway
npm init -y
npm install @anyway-sh/node-server-sdk
node -e "const sdk = require('@anyway-sh/node-server-sdk'); console.log('OK');"
```

## Dependency Strategy

The SDK depends on `@traceloop/instrumentation-*` and `@traceloop/ai-semantic-conventions` packages. These are:

- **Already published on npm** by Traceloop (version ~0.22.5)
- **Not renamed** in this fork (only the SDK was rebranded)
- **Compatible** with `@anyway-sh/node-server-sdk`

When users install the SDK, npm pulls the `@traceloop/*` instrumentation packages from the public registry automatically.

## Version Bumping

### All packages (via lerna)

```bash
pnpm lerna version --no-private --conventional-commits --yes
```

### SDK only (manual)

Update the version in two places:

1. `packages/anyway-sdk/package.json` — `"version"` field
2. `lerna.json` — `"version"` field (if you want lerna to track it)

## Automated Releases (GitHub Actions)

The repo has a release workflow at `.github/workflows/release.yml`.

### Setup

1. Generate an npm automation token at https://www.npmjs.com/settings/~/tokens
2. Add it as the `NPM_TOKEN` secret in your GitHub repo settings
3. Set up the GitHub App for version bumping:
   - Create a GitHub App (or use a PAT) and add `OSS_CI_BOT_APP_ID` and `OSS_CI_BOT_PRIVATE_KEY` as secrets
   - Or simplify the workflow to use `secrets.GITHUB_TOKEN` instead
4. **Important**: The workflow uses `pnpm lerna publish --no-private from-git` which publishes all non-private packages. Since the `@traceloop/*` instrumentation packages are not marked `private`, lerna will try to publish them too. To publish only the SDK, either:
   - Add `"private": true` to each instrumentation package's `package.json`
   - Or change the publish command to target only the SDK: `cd packages/anyway-sdk && npm publish --access public`

### Triggering

Go to Actions > "Release - Anyway SDK & Standalone Instrumentations" > Run workflow.
