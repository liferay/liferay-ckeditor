#!/bin/sh

set -e

function init() {
	# Make sure submodule is registered and up-to-date.
	git submodule update --init

	# Fetch remote changes.
	cd ckeditor-dev
	# not needed git fetch

	# Make sure our working copy is clean.
	git reset --hard HEAD --quiet
	git clean -fdx
}

function message() {
	if [[ ! -z "$1" ]] ; then
		echo
		printf -- '-%.0s' {1..80}; echo ""
		printf "%*s\n" $(( ( $(echo $1 | wc -c ) + 80 ) / 2 )) "$1"
		printf -- '-%.0s' {1..80}; echo ""
		echo

		if [[ ! -z  "$2" ]] ; then
			echo
			echo "$2" | fold -w 80
			echo
		fi
	fi
}

function usage() {
	echo "Usage: ck.sh COMMAND"
	echo
	echo "  Where COMMAND is either:"
	echo
	echo "  🔧  setup: Setup everything to start working on a patch"
	echo "  💉  patch: Generate patches "
	echo "  🔥  build: Generate a patched version of CKEditor"
	echo
	echo
}

# Check arguments
if [ $# -ne 1 ]; then
	usage
  exit 1
fi

COMMAND=$1

case "$COMMAND" in
	build)
		VERSION=$2

		init
		git checkout --detach HEAD --quiet

		# Warn the user and prompt to continue
		message "⚠️  WARNING"

		str=$(printf "%s\n" "This will generate a patched version of CKEditor" \
			"Are you sure you want to continue?")

		read -p "$str [y/n]? " yn

		case $yn in
			[Yy]*)
				git branch -f liferay HEAD
				git checkout liferay

				echo
				echo "Checking for existing patches"
				echo

				if ! ls ../patches/*; then
					echo "There doesn't seem to be any patch"
					# TODO: Probably exit?
					echo
				fi

				echo
				echo "Applying patches from \"patches/\" directory."
				echo

				if ! git am ../patches/*; then
					echo
					echo "⚠️ There was a problem applying patches:"
					echo
					echo "To retry manually and fix:"
					echo
					echo "  cd ckeditor-dev"
					echo "  git am --abort"
					echo "  git am ../patches/*"
					echo
					echo "Once you are happy with the result, run \`sh ./ck.sh patch\` to update the contents of \"patches/\"."
					echo
					exit 1
				fi

				if [ -n "$DEBUG" ]; then
					dev/builder/build.sh --build-config ../../../build-config.js \
						--leave-css-unminified --leave-js-unminified
				else
					dev/builder/build.sh --build-config ../../../build-config.js
				fi

				# Remove old build files.
				rm -rf ../ckeditor/*

				# Replace with new build files.
				cp -r dev/builder/release/ckeditor/* ../ckeditor/

				str=$(printf "%s\n" "Don't forget to commit the result!\n\n" \
					"    git add -A -- ckeditor\n" \
					"    git commit -m 'Update CKEDITOR'")

				message "✅  DONE" "$str"
				;;
			*)
				echo
				echo "Aborting."
				echo
		esac
		;;
	patch)
		init
		# Navigate back to superproject
		cd ..

		# Save SHA1 for later
		sha1=`git submodule | grep ckeditor-dev | awk '{print $1}' | sed -e s/[^0-9a-f]//`

		# CD into the right place
		cd ckeditor-dev

		# Check for the existence of the liferay branch in the submodule
		if ! git rev-parse --verify liferay &>/dev/null; then
			str=$(printf "%s"
				"It seems that there's no *liferay* branch in the *ckeditor-dev* submodule.\n\n" \
				"Please run *sh ./ck.sh setup* to set up.")

			message "❌  ERROR" "$str"
			exit 1
		fi

		git checkout liferay --quiet

		# Check for existing patches
		if ls ../patches/* &>/dev/null; then

			str=$(printf "%s\n" "This will replace any existing patches...")

			message "⚠️  WARNING" "$str"

			echo
			echo "$(ls ../patches/*)"
			echo

			# Prompt the user to confirm he wants to delete existing patches
			read -p "Are you sure you want to continue [y/n]? " yn
			case $yn in
				[Yy]*)
					echo
					echo "Removing existing patches."
					echo

					mkdir -p ../patches
					rm -rf ../patches/*
					;;
				*)
					echo
					echo "Aborting."
					echo
					exit 1
					;;
			esac
		else
			echo
			echo "No patches found."
			echo
		fi

		echo "Generating patches."
		echo

		git format-patch $sha1 -o ../patches

		str=$(printf "%s" "You can now build CKEditor with your patches.\n\n" \
			"Here are the steps to follow:\n\n" \
			"    1. Run \`sh ./ck.sh build\` to generate a patched version.")

		message "✅  DONE" "$str"
		;;
	setup)
		init
		git checkout --detach HEAD
		git branch -f liferay HEAD
		git checkout liferay

		str=$(printf "%s" "You can now start working on your patch(es).\n\n" \
			"Here are the steps to follow:\n\n" \
		  "    1. Navigate to the ckeditor-dev submodule directory (\`cd ckeditor-dev\`)\n" \
		  "    2. Make your changes\n" \
		  "    3. Commit your changes\n" \
		  "    4. Run \`sh ./ck.sh patch\` to generate the patches\n")

		message "✅  DONE" "$str"
		;;
	*)
		usage
		;;
esac

