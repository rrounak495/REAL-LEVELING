/**
 * metro.config.js — Real Leveling Mobile
 *
 * Two responsibilities:
 * 1. withNativeWind — processes global.css through PostCSS/Tailwind
 *    and makes class names available to the NativeWind runtime.
 * 2. Monorepo support — ensures Metro can resolve packages
 *    from the workspace root's node_modules.
 */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Monorepo root (two levels up from apps/mobile)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// ── Monorepo: Watch workspace root ──────────────────────────────────────
config.watchFolders = [workspaceRoot];

// ── Monorepo: Resolve from workspace root first ─────────────────────────
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// ── NativeWind: Process global.css ──────────────────────────────────────
module.exports = withNativeWind(config, {
  input: './global.css',
  // Inject the NativeWind CSS into the app's JS bundle
  inlineRem: 16,
});
