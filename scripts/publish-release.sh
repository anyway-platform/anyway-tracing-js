#!/bin/bash
set -e

SDK_DIR="$(cd "$(dirname "$0")/../packages/anyway-sdk" && pwd)"

cp "$SDK_DIR/package.json" "$SDK_DIR/package.json.bak"
trap 'echo "Restoring package.json..."; mv "$SDK_DIR/package.json.bak" "$SDK_DIR/package.json"' EXIT

echo "Converting workspace:* dependencies to published versions..."

python3 -c "
import json
with open('$SDK_DIR/package.json', 'r') as f:
    pkg = json.load(f)
deps = pkg.get('dependencies', {})
for key in list(deps.keys()):
    if deps[key] == 'workspace:*':
        deps[key] = '^0.22.5'
with open('$SDK_DIR/package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
    f.write('\n')
"

echo "Building..."
cd "$(dirname "$0")/.."
pnpm nx run @anyway-sh/node-server-sdk:build

echo "Publishing..."
cd "$SDK_DIR"
npm publish --access public

echo ""
echo "Published successfully!"
