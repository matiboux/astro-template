#!/bin/sh
set -e

if (
	# If the first argument is a flag,
	[ "${1#-}" != "$1" ] ||
	# Or,
	(
		# Unless the first argument is one of these commands,
		[ "$1" != 'npm' ] &&
		[ "$1" != 'npx' ] &&
		[ "$1" != 'node' ] &&
		# And, unless the first argument is one of these shells,
		[ "$1" != 'sh' ] &&
		[ "$1" != 'bash' ]
	)
	# Assume that the user wants to run npm
); then
	set -- npm "$@"
fi

exec docker-entrypoint.sh "$@"
