#!/bin/sh
# Scan for committed secrets across the full git history, using gitleaks
# (https://github.com/gitleaks/gitleaks).
#
# Usage: check_secrets_scan.sh        (from the repo root)
#
# If found in PATH, the `gitleaks` binary is used directly. Otherwise, a docker
# fallback is used (zricethezav/gitleaks image), with a bind mount if possible,
# or streaming a tar of `.git` over stdin otherwise.
#
# SECRETS_SCAN_BASELINE_PATH sets the path to an optional gitleaks baseline
# file (relative to the repo root). The baseline can capture known false
# positives already reviewed manually (e.g. well-known test tokens, etc.).
# This allows the scan to fail only on new findings (absent from the baseline)
# so that a real secret introduced in a future commit would still be detected.
#
# SECRETS_SCAN_GITLEAKS_IMAGE_TAG sets the tag of the zricethezav/gitleaks
# image used by the docker fallback. Default is 'latest'.
set -u

for arg in "$@"; do
	case "${arg}" in
		-h|--help)
			echo "Usage: ${0##*/}" >&2
			exit 0
			;;
		--)
			;;
		*)
			echo "Usage: ${0##*/}" >&2
			exit 1
			;;
	esac
done

current_dir="${0%/*}"
[ "${current_dir}" = "$0" ] && current_dir='.'
repo_dir="$(CDPATH= cd -- "${current_dir}/.." && pwd)"

baseline_path="${SECRETS_SCAN_BASELINE_PATH:-}"
[ -z "${baseline_path}" ] && baseline_path='.gitleaks-baseline.json'
has_baseline='false'
[ -f "${repo_dir}/${baseline_path}" ] && has_baseline='true'

gitleaks_image_tag="${SECRETS_SCAN_GITLEAKS_IMAGE_TAG:-}"
[ -z "${gitleaks_image_tag}" ] && gitleaks_image_tag='latest'

if command -v gitleaks >/dev/null 2>&1; then
	if [ "${has_baseline}" = 'true' ]; then
		run_gitleaks() {
			gitleaks git --no-banner --baseline-path "${repo_dir}/${baseline_path}"
		}
	else
		run_gitleaks() {
			gitleaks git --no-banner
		}
	fi
elif command -v docker >/dev/null 2>&1; then
	docker_image="zricethezav/gitleaks:${gitleaks_image_tag}"
	if docker run --rm -v "${repo_dir}:/probe" --entrypoint sh "${docker_image}" -c 'test -d /probe/.git' >/dev/null 2>&1; then
		if [ "${has_baseline}" = 'true' ]; then
			run_gitleaks() {
				docker run --rm \
					-e GIT_DISCOVERY_ACROSS_FILESYSTEM=1 \
					-v "${repo_dir}:/repo" \
					"${docker_image}" \
					git /repo --no-banner --baseline-path "/repo/${baseline_path}"
			}
		else
			run_gitleaks() {
				docker run --rm \
					-e GIT_DISCOVERY_ACROSS_FILESYSTEM=1 \
					-v "${repo_dir}:/repo" \
					"${docker_image}" \
					git /repo --no-banner
			}
		fi
	elif [ "${has_baseline}" = 'true' ]; then
		run_gitleaks() {
			tar -cf - .git "${baseline_path}" \
			| docker run --rm -i \
				--entrypoint sh \
				"${docker_image}" \
				-c "mkdir -p /repo && tar -xf - -C /repo && gitleaks git /repo --no-banner --baseline-path /repo/${baseline_path}"
		}
	else
		run_gitleaks() {
			tar -cf - .git \
			| docker run --rm -i \
				--entrypoint sh \
				"${docker_image}" \
				-c 'mkdir -p /repo && tar -xf - -C /repo && gitleaks git /repo --no-banner'
		}
	fi
else
	echo "⚠️  Skipping secrets scan: neither gitleaks nor docker found on PATH (https://github.com/gitleaks/gitleaks#installing)" >&2
	exit 0
fi

echo 'Scanning for secrets in git repo history...'

echo ''
if [ "${has_baseline}" = 'true' ]; then
	echo "📋 Running gitleaks (baseline: ${baseline_path})..."
else
	echo '📋 Running gitleaks (no baseline found)...'
fi
run_gitleaks
rc=$?

echo ''
if [ "${rc}" -ne 0 ]; then
	echo '❌ New secrets found in git repo history'
else
	echo '✅ No new secrets found in git repo history'
fi
exit "${rc}"
