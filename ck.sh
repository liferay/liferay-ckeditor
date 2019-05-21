#!/bin/bash

set -e

function check() {
	# Make sure submodule is registered and up-to-date.
	git submodule update --init

	cd ckeditor-dev

	if ! git rev-parse --verify liferay &>/dev/null; then
		echo
		echo "❌ ERROR"
		echo
		echo "It seems that there's no 'liferay' branch in the 'ckeditor-dev' submodule."
		echo
		echo "Please run 'sh ck.sh setup' to set up everything correctly."
		echo
		exit 1
	fi

	cd ..
}

function usage() {
	echo
	echo "Usage: ck.sh COMMAND [OPTIONS]"
	echo
	echo "  Where COMMAND is either:"
	echo
	echo "  🔧 setup: Setup everything to start working on a patch"
	echo "  💉 patch: Generate patches"
	echo "  🔥 build: Generate a patched version of CKEditor"
	echo "  🌶  update: Update the ckeditor-dev submodule to point at a new version"
	echo
	echo
}

# Check arguments
if [ $# -ne 1 ]; then
	usage
	exit 1
fi

trap "echo \"\n\nAborting.\n\"; exit" SIGHUP SIGINT SIGTERM

COMMAND=$1

case "$COMMAND" in
	build)
		check

		echo
		echo "⚠️  WARNING"
		echo

		echo "This will generate a patched version of CKEditor"
		read -r -p "Are you sure you want to continue? [y/n] " yn

		case $yn in
			[Yy]*)
				cd ckeditor-dev

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

				echo
				echo "✅ DONE"
				echo
				echo "Don't forget to commit the result!"
				echo
				;;
			*)
				echo
				echo "Aborting."
				echo
				exit
		esac
		;;

	patch)
		check

		# Save SHA1 for later
		sha1=$(git submodule status --cached -- ckeditor-dev | awk '{print $1}' | sed -e s/[^0-9a-f]//)

		cd ckeditor-dev

		# Check for the existence of the liferay branch in the submodule
		if ! git rev-parse --verify liferay &>/dev/null; then
			echo
			echo "❌ ERROR"
			echo
			echo "It seems that there's no 'liferay' branch in the 'ckeditor-dev' submodule."
			echo
			echo "Please run 'sh ck.sh setup' to set up everything correctly."
			echo
			exit 1
		fi

		git checkout liferay --quiet

		# Check for existing patches
		if ! ls ../patches/*.patch &>/dev/null ; then
			echo
			echo "No patches found."
			echo
		else
			echo
			echo "⚠️  WARNING"
			echo
			echo "This will reset the \"patches\" directory and replace these patches:"
			echo
			ls ../patches/*.patch | cat
			echo
			echo "with patches corresponding to these commits:"
			echo
			git log --oneline "$sha1"..HEAD
			echo

			# Prompt the user to confirm he wants to delete existing patches
			read -r -p "Are you sure you want to continue? [y/n] " yn
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
					exit
					;;
			esac
		fi

		echo "Generating patches."
		echo

		git format-patch "$sha1" -o ../patches

		echo
		echo "✅ DONE"
		echo
		echo "You can now build CKEditor with your patches."
		echo
		echo "Here are the steps to follow:"
		echo
		echo "1. Run 'sh ck.sh build' to generate a patched version."
		echo
		;;

	setup)
		echo
		echo "⚠️  WARNING"
		echo
		echo "❗ This will reset any changes you currently have in the 'ckeditor-dev' submodule"
		echo
		echo
		read -r -p "Are you sure you want to continue? [y/n] " yn
		case $yn in
			[Yy]*)
				# Make sure submodule is registered and up-to-date.
				git submodule update --init

				# Fetch remote changes.
				cd ckeditor-dev

				# Make sure our working copy is clean.
				git reset --hard HEAD --quiet
				git clean -fdx
				git checkout --detach HEAD --quiet
				git branch -f liferay HEAD
				git checkout liferay --quiet

				echo
				echo "Checking for existing patches"
				echo

				if ! ls ../patches/*.patch; then
					echo "There doesn't seem to be any patch"
				else
					echo
					echo "Applying patches from \"patches/\" directory."
					echo

					if ! git am ../patches/*; then
						echo
						echo "❌ There was a problem applying patches:"
						echo
						echo "To retry manually and fix:"
						echo
						echo "  cd ckeditor-dev"
						echo "  git am --abort"
						echo "  git am ../patches/*"
						echo
						echo "Once you are happy with the result, run 'sh ck.sh patch' to update the contents of \"patches/\"."
						echo
						exit 1
					fi
				fi

				echo
				echo "✅ DONE"
				echo
				echo
				echo "You can now start working on your patch(es)."
				echo
				echo
				echo "Here are the steps to follow:"
				echo
				echo "1. Navigate to the ckeditor-dev submodule directory ('cd ckeditor-dev')"
				echo "2. Work on your changes"
				echo "3. Commit your changes"
				echo "4. Run 'sh ck.sh patch' to generate the patches"
				echo
				;;
			*)
				echo
				echo "Aborting."
				echo
				exit
				;;
		esac
		;;

	update)
		git submodule update --init
		cd ckeditor-dev
		git fetch

		echo
		echo "Listing current tags: "

		tags=$(git tag -l --sort=creatordate | grep -v ee- | grep -v liferay | \
			sort -t. -k 1,1nr -k 2,2nr -k 3,3nr -k 4,4nr | head -6)

		echo "$tags"
		echo

		read -r -p "Please enter the tag you want to update to: " tag

		if ! git describe --exact-match --tags "$tag" &>/dev/null ; then
			echo
			echo "❌ ERROR"
			echo
			echo "Sorry, the \`$tag\` tag does not exist."
			echo
			exit 1
		fi


		echo
		echo "⚠️  WARNING"
		echo
		echo "This will update the \`ckeditor-dev\` submodule to point to the $tag tag"
		echo

		read -r -p "Are you sure you want to continue? [y/n] " yn
		case $yn in
			[Yy]*)
				git reset --hard HEAD
				git clean -fdx
				git checkout "$tag"

				commitmsg=$(git log --oneline | head -1)

				cd ..
				git add -f ckeditor-dev
				git commit -m "Update ckeditor-dev to $commitmsg"

				echo
				echo "✅ DONE"
				echo
				echo "To re-apply patches on top of the new version, run: \`ck.sh setup\`"
				;;
			*)
				echo
				echo "Aborting."
				echo
				exit
				;;
		esac
		;;

	*)
		usage
		;;

esac
