const sass = require('@stencil/sass');

exports.config = {
  nodeResolve: {
    browser: true
  },
  enableCache: false,
  copy: [
    {
      src: "../node_modules/firebase/firebase-*.js",
      dest: "assets/js"
    }
  ],
  outputTargets: [
    {
      type: 'www',
      serviceWorker: {
        swSrc: 'src/sw.js'
      },
      resourcesUrl: "build/app"
    }
  ],
  globalStyle: 'src/global/app.css',
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};