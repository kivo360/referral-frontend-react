const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  extraBabelIncludes: [
    "node_modules/axios",
    "node_modules/react-copy-to-clipboard",
    "node_modules/recharts",
    "node_modules/react-youtube",
    "node_modules/react-stripe-checkout",
    "node_modules/public-ip",
    "node_modules/sprintf-js",
  ],
  externals: {
    '@antv/data-set': 'DataSet',
    bizcharts: 'BizCharts',
    rollbar: 'rollbar'
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
  es5ImcompatibleVersions: true
};
