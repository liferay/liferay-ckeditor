var options = {
	artifactName: 'ckeditor',
	artifactSrc: ['dev/builder/release/ckeditor/**/*']
};

var gulp = require('liferay-gulp-tasks')(require('gulp'), options);
var requireDir = require('require-dir');

// Add the node_modules/.bin directory to the PATH
require('spawn-local-bin').path(__dirname);
