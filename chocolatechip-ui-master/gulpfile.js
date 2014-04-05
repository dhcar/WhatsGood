// Import modules:
var gulp = require('gulp')
,   pkg = require('./package.json')
,   less = require('gulp-less')
,   rename = require('gulp-rename')
,   concat = require('gulp-concat')
,   jshint = require('gulp-jshint')
,   header = require('gulp-header')
,   gutils = require('gulp-util')
,   replace = require('gulp-replace')
,   minifyCSS = require('gulp-minify-css')
,   uglify = require('gulp-uglify')
,   jshint = require('gulp-jshint')
,   header = require('gulp-header')
,   footer = require('gulp-footer');

// Define values for file headers:
var chui = ['ChUI-Android.css','ChUI-iOS.css','ChUI-Win.css','ChUI.js']
,   osNames = ['Android','iOS','Windows']
,   osTypes = ['android','ios','win'];

// Define header for ChUI files:
var chuiHeader = ['/*',
  '    pO\\',
  '   6  /\\',
  '     /OO\\',
  '    /OOOO\\',
  '   /OOOOOO\\',
  '  (OOOOOOOO)',
  '   \\:~==~:/',
  '',
  '<%= pkg.title %>',
  '<%= chuiName %>',
  'Copyright ' + gutils.date("yyyy") + ' Sourcebits www.sourcebits.com',
  'License: <%= pkg.licences[0].type %>',
  'Version: <%= pkg.version %>',
  '*/\n'].join('\n');

// Define header for minfied ChUI files:
var chuiHeaderMin = ['/*',
  '<%= pkg.title %>',
  '<%= chuiName %>',
  'Copyright ' + gutils.date("yyyy") + ' Sourcebits www.sourcebits.com',
  'License: <%= pkg.licences[0].type %>',
  'Version: <%= pkg.version %>',
  '*/\n'].join('\n');

// Define header for examples and demos:
var htmlHeader = ['<!DOCTYPE html>',
'<html lang="en"<%= langDir %>>',
'<head>',
'  <meta charset="utf-8">',
'  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
'  <meta name="apple-mobile-web-app-capable" content="yes">',
'  <meta name="mobile-web-app-capable" content="yes">',
'  <meta name="msapplication-tap-highlight" content="no">',
'  <title>ChocolateChip-UI <%= osName %></title>',
'  <link rel="stylesheet" href="../chui/chui-<%= osType %>-<%= pkg.version %>.css">',
'  <script src="<%= pkg.jquery.url %>"></script>',
'  <script src="../chui/chui-<%= pkg.version %>.js"></script>'].join('\n') + '\n';

// Process, minify and output LESS:
gulp.task('less', function () {
  osTypes.forEach(function(ctx, idx) {
    gulp.src('src/themes/' + ctx + '/main.less')
      .pipe(less())
      .pipe(rename('chui-' + ctx + '-' + pkg.version + '.css'))
      .pipe(header(chuiHeader, { pkg : pkg, chuiName: chui[idx] }))
      .pipe(gulp.dest(pkg.projectPath + 'chui/')).pipe(minifyCSS({}))
      .pipe(header(chuiHeaderMin, { pkg : pkg, chuiName: chui[idx] }))
      .pipe(rename('chui-' + ctx + '-' + pkg.version + '.min.css'))
      .pipe(gulp.dest(pkg.projectPath + './chui/'));;   
  });
});

// Concat, minify and output JavaScript:
gulp.task('js', function () {
  var chuijs_start = [
    '\(function\(\$\) {',
    '  \'use strict\';'
  ].join('\n');
  var chuijs_end = '\n\}\)\(window\.jQuery\);';

  gulp.src([
    'src/chui/utils.js', 
    'src/chui/events.js', 
    'src/chui/detectors.js', 
    'src/chui/gestures.js', 
    'src/chui/desktop.js', 
    'src/chui/layout.js', 
    'src/chui/pubsub.js', 
    'src/chui/navigation.js', 
    'src/chui/buttons.js', 
    'src/chui/blockui.js', 
    'src/chui/center.js', 
    'src/chui/busy.js', 
    'src/chui/popup.js', 
    'src/chui/popover.js', 
    'src/chui/segmented.js', 
    'src/chui/togglePanel.js', 
    'src/chui/paging.js', 
    'src/chui/deletableList.js', 
    'src/chui/selectList.js', 
    'src/chui/sheet.js', 
    'src/chui/slideout.js', 
    'src/chui/stepper.js', 
    'src/chui/switch.js', 
    'src/chui/scroll.js', 
    'src/chui/tabbar.js', 
    'src/chui/templates.js', 
    'src/chui/search.js', 
    'src/chui/carousel.js'
  ])
    .pipe(concat("chui-" + pkg.version + ".js"))
    .pipe(replace(/\(function\(\$\) {\n^.*\'use strict\';/img, ''))
    .pipe(replace(/\}\)\(window\.jQuery\);/img, ''))
    .pipe(replace(/\n\n\n/img, ''))
    .pipe(replace(/\n\n/img, '\n'))
    .pipe(header(chuijs_start))
    .pipe(footer(chuijs_end))
    .pipe(header(chuiHeader, { pkg : pkg, chuiName: chui[3] }))
    .pipe(gulp.dest(pkg.projectPath + 'chui/'))
    .pipe(uglify())
    .pipe(header(chuiHeaderMin, { pkg : pkg, chuiName: chui[3] }))
    .pipe(rename("chui-" + pkg.version + ".min.js"))
    .pipe(gulp.dest(pkg.projectPath + 'chui/'));;
});

// Create examples & demos (ltr or rtl):
gulp.task('examples', function() {
  var langDir = '';
  var rtl = gutils.env.dir === 'rtl';
  var dir = 'ltr';
  var prefix = '';
  if (rtl) {
    prefix = 'rtl-';
    dir = 'rtl';
    langDir =  ' dir="rtl"';
    // Copy out rtl images:
    gulp.src('src/rtl-images/**/*')
      .pipe(gulp.dest('rtl-images/'));
    // Copy out regular images & data:`
    gulp.run('copy');
  }
  osTypes.forEach(function(ctx, idx) {
    gulp.src('src/' + prefix + 'examples/**/*')
      .pipe(header(htmlHeader, { pkg : pkg, osType : osTypes[idx], osName : osNames[idx], dir : prefix[dir], langDir : langDir }))
      .pipe(gulp.dest(prefix + 'examples-' + ctx + '/'));
    gulp.src('src/' + prefix + 'demo/*.html')
      .pipe(header(htmlHeader, { pkg : pkg, osType : osTypes[idx], osName : osNames[idx], dir : prefix[dir], langDir : langDir }))
      .pipe(rename(prefix + 'demo-' + ctx + '.html'))
      .pipe(gulp.dest(prefix + 'demo/'));
  });
});

// Copy out media:
gulp.task('copy', function() {
  gulp.src('src/images/**/*')
    .pipe(gulp.dest('images/'));
  gulp.src('src/data/**/*')
    .pipe(gulp.dest('data/'));
});

// JSHint:
gulp.task('jshint', function() {
  gulp.src("chui-" + pkg.version + ".js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/* Define default task:
To build, just enter gulp in terminal.
To build right-to-left examples, use:

  gulp --dir rtl

*/
gulp.task('default', ['less','js','jshint','copy','examples']);

gulp.task('chui', ['less','js','jshint']);


// Watch LESS files and generate CSS:
gulp.task('watch', function() {
  gulp.watch('src/themes/**/*.less', ['less']);
});