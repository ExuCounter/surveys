var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

// Static server
gulp.task('default', function () {
   var files = [
      './**/*'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './'
      }
   });
});
