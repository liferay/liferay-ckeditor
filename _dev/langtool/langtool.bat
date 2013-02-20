@ECHO OFF
::
:: Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
:: For licensing, see LICENSE.html or http://ckeditor.com/license
::
::�Checks translation files in given directory.
::

CLS
ECHO.

SET PLUGINS=(a11yhelp devtools placeholder specialchar uicolor)

java -jar langtool/langtool.jar update ../../_source/lang
for %%P in %PLUGINS% do (
java -jar langtool/langtool.jar update ../../_source/plugins/%%P/lang
)
