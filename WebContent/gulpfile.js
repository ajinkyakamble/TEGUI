var gulp = require('gulp'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    templatePaths = [
    'TEG/views/*.html'
    ],
  //  gulpExec = require('child_process').exec,
  //  uglify = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug'),
    uglifycss = require('gulp-uglifycss'),
    scriptsPaths = [
    'TEG/controllers/*.js'
    ];


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
})
    
gulp.task('default', ['browserSync']);


////////////////////////////////////////////////
/// gulp build tasks
////////////////////////////////////////////////

/**
 * [gulp minifyjs - task to minify, uglify and strip debug statements of javascript file 
 * and copy it to production folder]
 */
gulp.task("minifyjs",function(){
    return gulp.src(["public-assets/*.js"])
        .pipe(stripDebug())
        // .pipe(uglify())
        .pipe(gulp.dest("production/public-assets/"))
});

/**
 * [gulp minifycss - task to minify and uglify css file 
 * and copy it to production folder]
 */
gulp.task("minifycss",function(){
    return gulp.src("public-assets/*.css")
        .pipe(uglifycss())
        .pipe(gulp.dest("production/public-assets/"))
});

/**
 * [gulp build-copy - task to copy images and fonts and paste it to prod folder]
 */
gulp.task("build-copy",function(cb){
    return gulp.src(["public-assets/**","!public-assets/*.js.map","!public-assets/*.css","!public-assets/*.js"])
        .pipe(gulp.dest("production/public-assets/"))
});

// gulp.task("index",function () {
//     return gulp.src("index.html").pipe(gulp.dest("production/"));
// })

/**
 * [gulp build - task to combine all the above build tasks into one]
 */
gulp.task("build",["minifyjs","minifycss","build-copy"]);



