const path = require('path');

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ['./node_modules', './src/assets'],
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@themeConfig': path.resolve(__dirname, 'themeConfig.js'),
        '@core': path.resolve(__dirname, 'src/@core'),
        '@validations': path.resolve(__dirname, 'src/@core/utils/validations/validations.js'),
        '@axios': path.resolve(__dirname, 'src/libs/axios'),
      },
    },
  },
  chainWebpack: (config) => {
    /*
      Disable (or customize) prefetch, see:
      https://cli.vuejs.org/guide/html-and-static-assets.html#prefetch
   */
    config.plugins.delete('prefetch');

    /*
       Configure preload to load all chunks
       NOTE: use `allChunks` instead of `all` (deprecated)
    */
    config.plugin('preload').tap((options) => {
      const o = options;
      o[0].include = 'allChunks';
      return o;
    });

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        // eslint-disable-next-line no-param-reassign
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src',
        };
        return options;
      });

    config.optimization.minimizer('terser').tap((args) => {
      const a = args;
      a[0].terserOptions.compress.drop_console = true;
      return a;
    });
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],
};
