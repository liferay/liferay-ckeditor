#!/bin/bash

# Build CKEditor Development Archive for use in Liferay Portal

CKEDITOR_VERSION="4.1.3"

ARCHIVE_FILE_NAME="ckeditor_"$CKEDITOR_VERSION"_liferay_dev.zip"

echo ""
echo "Creating git archive: "$ARCHIVE_FILE_NAME

git archive -o $ARCHIVE_FILE_NAME HEAD
