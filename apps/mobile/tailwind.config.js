/** @type {import('tailwindcss').Config} */
module.exports = {
  // ─── Content Paths ───────────────────────────────────────────────────
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],

  // ─── NativeWind Preset ───────────────────────────────────────────────
  presets: [require('nativewind/preset')],

  theme: {
    // ─── Override core scales with our Design System ──────────────────
    // We replace the default palettes that conflict with our brand.
    // Everything else (Tailwind utilities, spacing, etc.) is extended.

    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#000000',

      // ── Background / Void ──────────────────────────────────────────
      bg: {
        void: '#03030A',
        base: '#08080F',
        surface: '#0E0E1C',
        elevated: '#141428',
        overlay: '#1C1C38',
        scrim: 'rgba(3, 3, 10, 0.85)',
      },

      // ── Neon Purple — Primary Brand ────────────────────────────────
      purple: {
        950: '#0D0320',
        900: '#160538',
        800: '#2A0E60',
        700: '#4A1A9E',
        600: '#6B2FCC',
        500: '#8B3CF7',
        400: '#A855F7',
        300: '#C084FC',
        200: '#DDD6FE',
        neon: '#C800FF',
      },

      // ── Neon Blue — Secondary Brand ────────────────────────────────
      blue: {
        900: '#060920',
        800: '#0D1640',
        700: '#1A2E80',
        600: '#2448CC',
        500: '#3B5BF6',
        400: '#5E78F8',
        300: '#93AAF8',
        neon: '#00B4FF',
      },

      // ── Cyan & Magenta — Sparingly ─────────────────────────────────
      cyan: {
        neon: '#00FFFF',
      },

      // ── Stat Colors ────────────────────────────────────────────────
      stat: {
        str: '#FF4444',
        'str-neon': '#FF6B6B',
        int: '#3B5BF6',
        'int-neon': '#5E78F8',
        vit: '#00C853',
        'vit-neon': '#00FF88',
        wis: '#FFB300',
        'wis-neon': '#FFD000',
        cha: '#FF6AC1',
        'cha-neon': '#FF9FDB',
      },

      // ── Semantic ───────────────────────────────────────────────────
      success: '#10B981',
      'success-neon': '#00FF88',
      warning: '#F59E0B',
      'warning-neon': '#FFD000',
      danger: '#EF4444',
      'danger-neon': '#FF2244',
      premium: '#F59E0B',
      'premium-neon': '#FFD700',
      legendary: '#FF6B35',
      'legendary-neon': '#FF8C00',

      // ── Gold / Luxury ──────────────────────────────────────────────
      gold: {
        700: '#78350F',
        600: '#92400E',
        500: '#D97706',
        400: '#FCD34D',
        300: '#FDE68A',
        neon: '#FFD700',
      },

      // ── Text ───────────────────────────────────────────────────────
      text: {
        primary: '#F4F4FF',
        secondary: '#9CA3C8',
        muted: '#4B5280',
        inverse: '#08080F',
        'neon-purple': '#C084FC',
        'neon-blue': '#93AAF8',
        gold: '#FCD34D',
      },
    },

    // ─── Extend with Design-System-specific additions ─────────────────
    extend: {
      // ── Font Families ─────────────────────────────────────────────
      fontFamily: {
        rajdhani: ['Rajdhani_700Bold', 'Rajdhani_600SemiBold', 'sans-serif'],
        'exo-2': ['Exo2_700Bold', 'Exo2_600SemiBold', 'Exo2_400Regular', 'sans-serif'],
        inter: ['Inter_400Regular', 'Inter_600SemiBold', 'Inter_700Bold', 'sans-serif'],
        mono: ['JetBrainsMono_400Regular', 'JetBrainsMono_600SemiBold', 'monospace'],
        jp: ['NotoSerifJP_900Black', 'serif'],
      },

      // ── Font Sizes — Design System Type Scale ─────────────────────
      fontSize: {
        'display-hero': ['56px', { lineHeight: '60px', letterSpacing: '-0.02em' }],
        'display-xl': ['44px', { lineHeight: '50px', letterSpacing: '-0.02em' }],
        'display-lg': ['36px', { lineHeight: '42px', letterSpacing: '-0.02em' }],
        'heading-xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
        'heading-lg': ['22px', { lineHeight: '30px' }],
        'heading-md': ['18px', { lineHeight: '26px' }],
        'heading-sm': ['15px', { lineHeight: '22px' }],
        'body-lg': ['16px', { lineHeight: '26px' }],
        'body-md': ['14px', { lineHeight: '22px' }],
        'body-sm': ['12px', { lineHeight: '18px' }],
        'stat-xl': ['32px', { lineHeight: '36px' }],
        'stat-lg': ['24px', { lineHeight: '28px' }],
        'stat-md': ['16px', { lineHeight: '20px' }],
        'stat-sm': ['12px', { lineHeight: '16px' }],
        'label-caps': ['11px', { lineHeight: '16px', letterSpacing: '0.08em' }],
      },

      // ── Border Radius ─────────────────────────────────────────────
      borderRadius: {
        sharp: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
        pill: '9999px',
      },

      // ── Spacing (8pt grid supplements) ───────────────────────────
      // Tailwind's default scale covers most cases.
      // We add semantic screen-level tokens here.
      spacing: {
        'screen-h': '20px', // horizontal screen margin
        'screen-v': '24px', // vertical screen padding
      },

      // ── Box Shadow / Glow System ─────────────────────────────────
      boxShadow: {
        // Elevation shadows
        'elevation-sm': '0 2px 8px rgba(0,0,0,0.60)',
        'elevation-md': '0 4px 16px rgba(0,0,0,0.70)',
        'elevation-lg': '0 8px 32px rgba(0,0,0,0.80)',
        'elevation-xl': '0 16px 64px rgba(0,0,0,0.90)',

        // Neon glows — Ambient tier
        'glow-purple-ambient': '0 0 12px rgba(139, 60, 247, 0.35)',
        'glow-blue-ambient': '0 0 12px rgba(59, 91, 246, 0.35)',
        'glow-cyan-ambient': '0 0 12px rgba(0, 180, 255, 0.30)',
        'glow-gold-ambient': '0 0 12px rgba(252, 211, 77, 0.30)',
        'glow-danger-ambient': '0 0 12px rgba(239, 68, 68, 0.30)',

        // Neon glows — Active tier
        'glow-purple-active':
          '0 0 20px rgba(139, 60, 247, 0.55), 0 0 40px rgba(139, 60, 247, 0.25)',
        'glow-blue-active': '0 0 20px rgba(59, 91, 246, 0.55), 0 0 40px rgba(59, 91, 246, 0.25)',
        'glow-gold-active': '0 0 20px rgba(252, 211, 77, 0.50), 0 0 40px rgba(252, 211, 77, 0.20)',

        // Neon glows — Surge tier (ceremonies only)
        'glow-purple-surge':
          '0 0 40px rgba(200, 0, 255, 0.80), 0 0 80px rgba(139, 60, 247, 0.50), 0 0 120px rgba(139, 60, 247, 0.20)',
        'glow-gold-surge':
          '0 0 40px rgba(255, 215, 0, 0.80), 0 0 80px rgba(245, 158, 11, 0.50), 0 0 120px rgba(245, 158, 11, 0.20)',
      },

      // ── Animation Durations ───────────────────────────────────────
      transitionDuration: {
        flash: '100ms',
        quick: '200ms',
        normal: '300ms',
        slow: '500ms',
        dramatic: '800ms',
        cinematic: '1200ms',
      },

      // ── Animation Easing ─────────────────────────────────────────
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
        decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
        accelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
        snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1.0)',
      },
    },
  },

  plugins: [],
};
