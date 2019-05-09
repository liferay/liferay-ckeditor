#!/bin/sh

set -e

# Delete the "patches" directory is
[ -d "./patches" ] && rm -r patches

# Go into the submodule directory and
# generate the patch files
cd ckeditor-dev

git format-patch -1 liferay -o ../patches

