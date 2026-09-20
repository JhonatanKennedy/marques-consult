#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

npm --prefix "$root/backend" run start:dev &
npm --prefix "$root/frontend" run dev &

wait
