

/*
=========================================================
* Dash UI - Bootstrap 5 Admin & Dashboard Theme
=========================================================
* Product Page: https://codescandy.com/dashui/index.html
* Copyright 2020 Codescandy (https://codescandy.com/)
* Designed and coded by https://codescandy.com
========================================================= */





// Load plugins
const { src, dest, watch, parallel, series } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const gulpautoprefixer = require('gulp-autoprefixer');
const browsersync = require("browser-sync").create();
const fileinclude = require('gulp-file-include');
const useref = require('gulp-useref');
const cached = require("gulp-cached");
const gulpIf = require("gulp-if");
const del = require('del');
const npmDist = require('gulp-npm-dist');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const replace = require('gulp-replace');
const terser = require('gulp-terser');
var rename = require("gulp-rename");
var minify = require('gulp-minify');
const javascriptObfuscator = require('gulp-javascript-obfuscator');





// Paths to project folders


 const paths = {
  base:{
    base: './',
    node: './node_modules'
    },
  src:{
    basesrc: './src',
    basesrcfiles: './src/**/*',
    scss: './src/assets/scss/**/*.scss',
    css: './src/assets/css/*.css',
    cssmap: './src/assets/css/*.css.map',
    cssmin: './src/assets/css/**.min.css',
    js: './src/assets/js/**/*.js',
    jsmap: './src/assets/js/**/*.map',
    umd: './src/assets/js/**/*.umd.js',
    umdmap: './src/assets/js/**/*.umd.js.map',
    jsmin: './src/assets/js/**/*.min.js',
    vendor: './src/assets/vendor/**/*.*',
    vendormap: './src/assets/vendor/**/*.js.map',
    html: './src/**/*.html',
    images: './src/assets/images/**/*',
    img: './src/assets/img/**/*',
    audio: './src/assets/audio/**/*',
    fonts: './src/assets/fonts/**/*',
    partials: '.src/partials/**/*',
    serverjs: './src/*.js',
    certs: './src/certs/*',
    },
  temp:{
    basetemp: './.temp'
    },
  dist:{
    basedist: './dist',
    js: './dist/assets/js',
    jsmin: './dist/assets/jsmin',
    vendor: './dist/assets/vendor',
    images: './dist/assets/images',
    img: './dist/assets/img',
    audio: './dist/assets/audio',
    css: './dist/assets/css',
    fonts: './dist/assets/fonts',
    libs: './dist/assets/libs',
    serverjs: './dist',
    certs: './dist/certs',
    assets: './dist/assets'

    }
}

// certs
function certs(callback) {
  return src(paths.src.certs)
      .pipe(dest(paths.dist.certs));
    callback();
}

// serverjs node script
function serverjs(callback) {
  return src(paths.src.serverjs)
      .pipe(dest(paths.dist.serverjs));
    callback();
}

// normal JS
function jsfilesDEV(callback) {
  return src([paths.src.js,paths.src.jsmap,paths.src.jsmin])
        .pipe(dest(paths.dist.js))
    callback();
}
// *.js.map
function jsmap(callback) {
  return src([paths.src.jsmap, paths.src.umdmap])
        .pipe(dest(paths.dist.js))
    callback();
}

// *.min.js
function jsmin(callback) {
  return src([paths.src.jsmin, paths.src.umd])
        .pipe(dest(paths.dist.js))
    callback();
}

// normal JS
function jsfiles(callback) {
  return src([paths.src.js, '!src/assets/js/**/*.min.js', '!src/assets/js/**/*.umd.js', '!src/assets/js/**/*.umd.js.map'])
        .pipe(minify())
        .pipe(javascriptObfuscator())
        .pipe(dest(paths.dist.jsmin))
    callback();
}

// JS vendor
function vendor(callback) {
  return src(paths.src.vendor)
        .pipe(dest(paths.dist.vendor))
    callback();
}
// JS vendormap
function vendormap(callback) {
  return src(paths.src.vendormap)
        .pipe(dest(paths.dist.vendor))
    callback();
}

// manifest.json
function manifest(callback) {
  return src(['./src/manifest.json','./src/app.js' ])
        .pipe(dest(paths.dist.assets))
    callback();
}

// Clean Dist folder
function cleanNonMinifyJS(callback) {
  return src(paths.dist.jsmin+'/*-min.js')
    .pipe(dest(paths.dist.js))
  callback();
}

// CSS
function cssfiles(callback) {
  return src([paths.src.css,paths.src.cssmap,paths.src.cssmin])
        .pipe(dest(paths.dist.css))
    callback();
}


// SCSS to CSS
function scss(callback) {
    return src(paths.src.scss)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulpautoprefixer())
        .pipe(dest(paths.src.css))
        .pipe(browsersync.stream());
    callback();
}


// Image
function images(callback) {
  return src(paths.src.images)
        .pipe(dest(paths.dist.images))
    callback();
}

function img(callback) {
  return src(paths.src.img)
        .pipe(dest(paths.dist.img))
    callback();
}

// Audio
function audio(callback) {
  return src(paths.src.audio)
        .pipe(dest(paths.dist.audio))
    callback();
}



// Font task
function fonts(callback) {
    return src(paths.src.fonts)
    .pipe(dest(paths.dist.fonts))
    callback();
}


// HTML
function html(callback) {
  return src([paths.src.html, '!./src/partials/**/*'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
        .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1assets/libs'))
        .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1assets/libs'))
        .pipe(useref())
        .pipe(cached())
        .pipe(gulpIf('*.css', postcss([ autoprefixer(), cssnano() ]))) // PostCSS plugins with cssnano
        .pipe(gulpIf('*.js', terser()))
        .pipe(gulpIf('*.html', rename(function(path){ path.extname = ".ejs";})))
        .pipe(dest(paths.dist.basedist))
        .pipe(browsersync.stream());
    callback();
}


// File include task for temp
function fileincludeTask(callback) {
  return src([paths.src.html, '!./src/partials/**/*'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(cached())
    .pipe(dest(paths.temp.basetemp));
    callback();
}


// Copy libs file from nodemodules to dist
function copyLibs(callback) {
  return src(npmDist({
    copyUnminified: true, 
    replaceDefaultExcludes: true,
    excludes:[
      'src/**/*',
      'examples/**/*',
      'example/**/*',
      'demo/**/*',
      'spec/**/*',
      'docs/**/*',
      'tests/**/*',
      'test/**/*',
      'Gruntfile.js',
      'gulpfile.js',
      'package.json',
      'package-lock.json',
      'bower.json',
      'composer.json',
      'yarn.lock',
      'webpack.config.js',
      'README',
      'LICENSE',
      'CHANGELOG',
      '*.yml',
      '*.md',
      '*.coffee',
      '*.ts',
      '*.scss',
      '*.less'
    ]
  }),{base: paths.base.node})
    .pipe(dest(paths.dist.libs));
  callback();
}


// Clean .temp folder
function cleanTemp(callback) {
    del.sync([paths.temp.basetemp, paths.dist.jsmin]);
    callback();
}


// Clean Dist folder
function cleanDist(callback) {
     del.sync(paths.dist.basedist);
     callback();
}


// Browser Sync Serve
function browsersyncServe(callback){
  browsersync.init({
    server: {
      baseDir: [paths.temp.basetemp, paths.src.basesrc, paths.base.base]
    }
  });
  callback();
}


// SyncReload
function syncReload(callback){
  browsersync.reload();
  callback();
}





// Watch Task
function watchTaskWithBrowserSync(){
    watch(paths.src.html, series( fileincludeTask, syncReload));
    watch([paths.src.images, paths.src.fonts], series(images, fonts));
    //watch([paths.src.scss], series(scss, syncReload));
}

// Watch Task
function watchTask(){
    watch(paths.src.html, series(html));
    watch(paths.src.js, series(jsfilesDEV));
    watch(paths.src.serverjs, series(serverjs));
    watch([paths.src.images, paths.src.fonts, paths.src.css], series(images, img, fonts, cssfiles));
    //watch([paths.src.scss], series(scss));
  
}


// Default Task Preview
exports.default = series(parallel(cleanDist), certs, serverjs, jsfilesDEV, cssfiles, vendor, vendormap, manifest, html, images, img, audio, fonts, copyLibs, watchTask);

exports.preview = series( fileincludeTask, browsersyncServe, watchTaskWithBrowserSync);

// Build Task for Dist
exports.build = series(parallel(cleanDist), certs, serverjs, jsfiles, cssfiles, jsmin, jsmap, vendor, vendormap, cleanNonMinifyJS, manifest, html, images, img,  audio,  fonts, copyLibs, cleanTemp);


// export tasks
exports.scss = scss
exports.images = images;
exports.img = img;
exports.fonts = fonts
exports.html = html;
exports.fileincludeTask = fileincludeTask
exports.copyLibs = copyLibs
exports.cleanTemp = cleanTemp
exports.cleanDist = cleanDist