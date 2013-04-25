#!/bin/bash

#Get current SVN Revision
REV=$(git log -1 --pretty=%B svn/3.6.x | grep 'git-svn-id:' | sed 's/^.*@//' | sed s:\ [a-z0-9\-]*$::g);

if [ -z "$REV" ]; then
	REV="7691";
fi;

echo 'Using SVN revision: '$REV;

#Download svn:externals
curl -o _dev/langtool/langtool/langtool.exe http://svn.fckeditor.net/CKLangTool/trunk/bin/langtool.exe?p=$REV;
curl -o _dev/langtool/langtool/langtool.jar http://svn.fckeditor.net/CKLangTool/trunk/bin/langtool.jar?p=$REV;
curl -o _dev/releaser/ckreleaser/ckreleaser.exe http://svn.fckeditor.net/CKReleaser/trunk/bin/ckreleaser.exe?p=$REV;
curl -o _dev/releaser/ckreleaser/ckreleaser.jar http://svn.fckeditor.net/CKReleaser/trunk/bin/ckreleaser.jar?p=$REV;
