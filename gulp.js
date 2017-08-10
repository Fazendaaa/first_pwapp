gulp.task('generate-sw', () => {
    const swOptions = {
        staticFileGlobs: [
            './index.html',
            './images/*.{png, svg, gif, jpg}',
            './scripts/*.js',
            './styles/*.css'
        ],
        stripPrefix: '.',
        runtimeCaching: [{
            urlPattern: /^https:\/\/publicdata-weather\.firebaseio\.com/,
            handler: 'networkFirst',
            options: {
                cache: {
                    name: 'weatherData-v3'
                }
            }
        }]
    };

    return swPrecache.write('./service-worker.js', swOptions);
});

gulp.task('serve', ['generate-sw'], () => {

});
