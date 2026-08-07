.PHONY: help install update check test-unit test-e2e audit secrets ci

help:
	@printf '%s\n' \
		'install	Install dependencies' \
		'update     Update dependencies' \
		'check      Run Astro and TypeScript checks' \
		'test-unit  Run unit tests' \
		'test-e2e   Build app and run browser tests' \
		'audit      Audit Node dependencies' \
		'secrets    Scan git history for secrets' \
		'ci         Run lint, tests, audit, and secrets scan'

install:
	@cd app && pnpm ci

update:
	@cd app && pnpm update

check:
	@cd app && pnpm run check

test-unit:
	@cd app && pnpm run test:vitest

test-e2e:
	@cd app && pnpm run build-only && pnpm run test:playwright

audit:
	@sh scripts/check_node_audit.sh

secrets:
	@sh scripts/check_secrets_scan.sh

ci: lint test-unit test-e2e audit secrets
