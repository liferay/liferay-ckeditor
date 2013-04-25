#!/bin/bash

# Setup git-svn
git svn init http://svn.ckeditor.com/CKEditor --prefix=svn/ --stdlayout --branches=branches/versions --ignore-paths="^(CKEditor/trunk|(CKEditor/branches/versions|CKEditor/tags)/(3[^\\\.]|3\\\.[^6]))";
#--ignore-paths allows us to download only the branches/tags we care about. ie. 3.6.x

echo 'This may take a while (30+ min), depending on the staleness of your repository.';
git svn fetch --log-window-size=10000 --revision 7691:HEAD;

sh update-externals.sh
