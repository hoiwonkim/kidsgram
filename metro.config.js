// ./metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve(
        'metro-react-native-babel-transformer'
      ),
    },
    resolver: {
      sourceExts: [...sourceExts, 'ts', 'tsx'],
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
    },
  };
})();

