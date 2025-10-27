// Load environment variables before babel compilation
require('./config/load-env');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'transform-inline-environment-variables',
      'react-native-reanimated/plugin',
    ],
  };
};
