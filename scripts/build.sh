#!/bin/sh

set -e

# Make sure submodule is registered and up-to-date.
git submodule update --init

# Apply the patch
cd ckeditor-dev
git checkout master
git pull
git checkout liferay
git reset --hard origin/master
git am ../patches/*

# Make the debug or release build.
if [ -n "$DEBUG" ]; then
	dev/builder/build.sh --build-config ../../../build-config.js --leave-css-unminified --leave-js-unminified
else
	dev/builder/build.sh --build-config ../../../build-config.js
fi

# Remove old build files.
rm -rf ../ckeditor/*

# Replace with new build files.
cp -r dev/builder/release/ckeditor/* ../ckeditor/

