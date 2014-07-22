#!/usr/bin/env bash

# Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

VERSION="3.6.6.2"

if [ -L $0 ] ; then
    DIR=$(dirname $(readlink -f $0)) ;
else
    DIR=$(dirname $0) ;
fi ;

LANGTOOL="$(cd $(dirname "$0"); pwd)/langtool.sh"

rm -rf release

pushd $DIR
java -jar ckreleaser/ckreleaser.jar ckreleaser.release ../.. release $VERSION DELETE --run-before-release=$LANGTOOL
popd

rm release/DELETE.tar.gz
rm release/DELETE.zip

echo ""
echo "Stamping ZIP with SHA..."
echo ""

ant zip -Drelease.file.name=ckeditor_"$VERSION"_liferay.zip