#!/bin/sh

set -e

# Make sure submodule is registered and up-to-date.
git submodule update --init

# Fetch remote changes.
cd ckeditor-dev
git fetch

# Make sure our working copy is clean.
git reset --hard HEAD
git clean -fdx

# Create a liferay branch for our patches
git checkout -b liferay

