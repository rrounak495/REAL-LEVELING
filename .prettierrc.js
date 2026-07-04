/**
 * .prettierrc.js — Real Leveling
 *
 * Single Prettier config at the monorepo root — applies to all workspaces.
 */
module.exports = {
  // Semicolons — yes, prevents ASI edge-cases
  semi: true,
  // Trailing commas — "all" means function params too (ES2017+)
  trailingComma: 'all',
  // Single quotes — consistent with JS ecosystem convention
  singleQuote: true,
  // 100 chars — wider than default 80, better for modern screens
  printWidth: 100,
  // 2-space indent — standard for JS/TS
  tabWidth: 2,
  // Always use spaces (not tabs)
  useTabs: false,
  // Spaces inside object literals: { foo: 'bar' }
  bracketSpacing: true,
  // Arrow function parens: always — (x) => x, not x => x
  arrowParens: 'always',
  // JSX quotes — double quotes in JSX attributes
  jsxSingleQuote: false,
  // End of line — LF on all platforms (critical for cross-platform teams)
  endOfLine: 'lf',
};
