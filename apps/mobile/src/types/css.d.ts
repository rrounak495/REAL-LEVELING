/**
 * css.d.ts — CSS Module Type Declarations
 *
 * Allows TypeScript to accept CSS file imports without error.
 * NativeWind's global.css is imported in _layout.tsx as a side effect.
 */
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
