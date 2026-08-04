#!/bin/sh
# Lint Dockerfiles across the repo, using hadolint
# (https://github.com/hadolint/hadolint).
#
# Usage: check_docker_lint.sh [dockerfile...]
#
# Dockerfiles to lint can be passed as command line arguments, or via the
# DOCKER_LINT_FILES environment variable (one entry per line). Otherwise,
# DOCKER_LINT_DEFAULT_FILES is used ('app/Dockerfile' by default).
#
# Files that do not exist are skipped (no failure).
#
# DOCKER_LINT_CONFIG_PATH sets the path to an optional hadolint config file
# (relative to the repo root). Default is '.hadolint.yaml'. If not found, no
# config is used and hadolint's defaults apply.
#
# If found in PATH, the `hadolint` binary is used directly. Otherwise, a
# docker fallback is used (hadolint/hadolint image), streaming each file's
# content via stdin so no bind mount is required.
#
# DOCKER_LINT_HADOLINT_IMAGE_TAG sets the tag of the hadolint/hadolint image
# used by the docker fallback. Default is 'latest'.
set -u

default_files='app/Dockerfile'

files=''

after_dashdash='false'
for arg in "$@"; do
	if [ "${after_dashdash}" = 'true' ]; then
		files="$(printf '%s\n%s' "${files}" "${arg}")"
		continue
	fi
	case "${arg}" in
		-h|--help)
			echo "Usage: ${0##*/} [dockerfile...]" >&2
			exit 0
			;;
		--)
			after_dashdash='true'
			;;
		-*)
			echo "Usage: ${0##*/} [dockerfile...]" >&2
			exit 1
			;;
		*)
			files="$(printf '%s\n%s' "${files}" "${arg}")"
			;;
	esac
done

if [ -z "${files}" ]; then
	files="${DOCKER_LINT_FILES:-}"
fi
if [ -z "${files}" ]; then
	files="${DOCKER_LINT_DEFAULT_FILES:-}"
fi
if [ -z "${files}" ]; then
	files="${default_files}"
fi
if [ -z "${files}" ]; then
	echo 'No Dockerfiles to lint' >&2
	exit 0
fi

current_dir="${0%/*}"
[ "${current_dir}" = "$0" ] && current_dir='.'
repo_dir="$(CDPATH= cd -- "${current_dir}/.." && pwd)"

config_path="${DOCKER_LINT_CONFIG_PATH:-}"
[ -z "${config_path}" ] && config_path='.hadolint.yaml'
has_config='false'
[ -f "${repo_dir}/${config_path}" ] && has_config='true'

hadolint_image_tag="${DOCKER_LINT_HADOLINT_IMAGE_TAG:-}"
[ -z "${hadolint_image_tag}" ] && hadolint_image_tag='latest'

if command -v hadolint >/dev/null 2>&1; then
	run_hadolint() {
		local file="$1"
		if [ "${has_config}" = 'true' ]; then
			hadolint --config "${repo_dir}/${config_path}" "${file}"
		else
			hadolint "${file}"
		fi
	}
elif command -v docker >/dev/null 2>&1; then
	docker_image="hadolint/hadolint:${hadolint_image_tag}"
	run_hadolint() {
		local file="$1"
		if [ "${has_config}" = 'true' ]; then
			docker run --rm -i \
				-v "${repo_dir}/${config_path}:/.hadolint.yaml:ro" \
				"${docker_image}" \
				hadolint --config /.hadolint.yaml - < "${file}"
		else
			docker run --rm -i \
				"${docker_image}" \
				hadolint - < "${file}"
		fi
	}
else
	echo '⚠️  Skipped lint: Neither Hadolint nor Docker found on PATH' >&2
	exit 0
fi

nb_files="$(printf '%s\n' "$files" | grep -c .)"
if [ "${nb_files}" -eq 0 ]; then
	echo 'ℹ️  No Dockerfiles to lint (DOCKER_LINT_FILES is empty)'
	exit 0
fi
if [ "${nb_files}" -eq 1 ]; then
	echo "Linting 1 Dockerfile..."
else
	echo "Linting ${nb_files} Dockerfiles..."
fi

linted=0
failed_lints=''

lint_file() {
	local file="$1"
	[ -z "${file}" ] && return 0
	echo ''
	if [ ! -f "${repo_dir}/${file}" ]; then
		echo "ℹ️  Skipping ${file}: File not found"
		return 0
	fi
	if [ "${has_config}" = 'true' ]; then
		echo "📋 Running hadolint for ${file} (config: ${config_path})..."
	else
		echo "📋 Running hadolint for ${file} (no config found)..."
	fi
	linted=$((linted + 1))
	run_hadolint "${repo_dir}/${file}"
	if [ "$?" -ne 0 ]; then
		failed_lints="$(printf '%s\n%s' "${failed_lints}" "${file}")"
	fi
}

while IFS= read -r file; do
	lint_file "${file}"
done <<EOF
$files
EOF

echo ''
if [ -n "${failed_lints}" ]; then
	nb_failed_lints="$(printf '%s\n' "${failed_lints}" | grep -c .)"
	echo "❌ ${nb_failed_lints} Dockerfile(s) with lint issues:"
	printf '%s\n' "${failed_lints}" | while IFS= read -r file; do
		[ -z "${file}" ] && continue
		echo "  - ${file}"
	done
	exit 1
fi
if [ "${linted}" -eq 0 ]; then
	echo 'ℹ️  No Dockerfiles linted'
	exit 0
fi
echo "✅ Docker lint passed on ${linted} Dockerfile(s)"
