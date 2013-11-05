::
:: Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::

SET VERSION="3.6.6.1"

@ECHO OFF

CLS
ECHO.

rmdir /S /Q release >NUL 2>NUL

java -jar ckreleaser/ckreleaser.jar ckreleaser.release ../.. release %VERSION% DELETE --run-before-release=langtool.bat

DEL release\DELETE.tar.gz
DEL release\DELETE.zip

ECHO.
ECHO Stamping ZIP with SHA...
ECHO.

ant zip -Drelease.file.name=ckeditor_%VERSION%_liferay.zip