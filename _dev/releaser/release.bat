::
:: Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::

@ECHO OFF

CLS
ECHO.

:: rmdir /S /Q release

java -jar ckreleaser/ckreleaser.jar ckreleaser.release ../.. release "3.6.6.1" ckeditor_3.6.6.1 --run-before-release=langtool.bat
