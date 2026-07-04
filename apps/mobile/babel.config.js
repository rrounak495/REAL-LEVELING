/**
 * babel.config.js — Real Leveling Mobile
 *
 * Three critical responsibilities:
 * 1. NativeWind v4 — jsxImportSource transforms className → StyleSheet
 * 2. Reanimated — plugin MUST be last to avoid conflicts with other transforms
 * 3. Module resolver — runtime path alias resolution (mirrors tsconfig.json paths)
 */
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // NativeWind v4: required for className prop support on all RN components
          jsxImportSource: 'nativewind',
        },
      ],
    ],

    plugins: [
      // ── Path Aliases ────────────────────────────────────────────────
      // Must mirror the "paths" in tsconfig.json exactly.
      // This resolves aliases at runtime (Metro bundler).
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@theme': './src/theme/index',
            '@store': './src/store/index',
            '@lib': './src/lib',
            '@features': './src/features',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@types': './src/types',
            '@db': './src/db',
          },
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      ],

      // ── Reanimated ──────────────────────────────────────────────────
      // MUST be the last plugin. Reanimated worklets require
      // the Babel transform to run after all other transforms.
      'react-native-reanimated/plugin',
    ],
  };
};
