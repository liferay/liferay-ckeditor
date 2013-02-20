#!/usr/bin/env bash

# Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license

if [ -L $0 ] ; then
    DIR=$(dirname $(readlink -f $0)) ;
else
    DIR=$(dirname $0) ;
fi ;

LANGTOOL="$(cd $(dirname "$0"); pwd)/langtool.sh"

pushd $DIR
java -jar ckreleaser/ckreleaser.jar ckreleaser.release ../.. release "3.6.6" ckeditor_3.6.6 --run-before-release=$LANGTOOL
popd
