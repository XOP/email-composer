module.exports = {
    port: 3000,
    browsers : [
        '> 1%',
        'last 20 versions',
        'BlackBerry > 0',
        'Android > 0'
    ],
    paths: {
        index: 'default.html',
        css: {
            src : 'assets/css',
            dest : 'public/css',
            build : 'build/css'
        },
        img: {
            src: 'assets/img',
            dest: 'public/img'
        }
    }
};
