# LOGME — Hallmark design system

Scope: home and workspace, plus restoring the GitHub entry in both primary navigation variants. Existing article list/detail, resume, global layout and styles are preserved. Home feature videos, their files and interaction are preserved.

## Direction
Modern-minimal, compact writing utility. Keep LOGME blue as a small functional accent, with near-white surfaces and dark ink. Avoid promotional eyebrows, numbered feature triplets, large greeting banners, repeated cards and excessive vertical space.

## Page structure
- Home: product-led opening. Compact split heading/action block, existing live feature demo immediately beneath it, two concise secondary paths and inline footer. No extra fake screenshots or decorative chrome.
- Workspace: compact working index. A small navigation rail, primary draft and recent-record area, narrow utility column. No marketing enrichment. Row shapes also define skeleton geometry.

## Typography
Existing Korean-compatible system stack is deliberately preserved to avoid new remote font loading and changing other pages. 700 display, 400 body, 600 controls. Display max 44px on home; workspace title 24px. Roman headings, tight tracking, tabular dates. Native monospace only for the small LOGME label.

## Tokens
`tokens.css` is the source of truth, compiled into `styles/logmeDesign.module.scss` with Sass `@use`. The `.root` selector is local to that CSS module. Named ink, muted, surface, rule, accent, focus, danger, loading and spacing tokens. No global CSS changes. Focus is immediate; links/buttons have 44px touch targets. No page reveal animation; existing video behavior is preserved. Skeleton uses restrained opacity animation and stops with reduced-motion.

## Layout
Desktop home intro uses an asymmetric split. Desktop workspace rail is 152px and main content grows; secondary utility column is 240px when space allows. At 768px utilities become a compact row; at phone widths they stack. Mobile page gutters are 20px, owned by the shared Layout and matched to article detail; page roots do not add horizontal padding. Sections use 16–24px gaps; rows 12px internal padding. No forced full-viewport height.

## States
Initial identity, draft, recent-post, resume, and backup loading each have shape-matched skeletons. Data errors are distinct from empty data. Existing account API can return null; keep the retry state. Background refresh retains readable data. No invented counts or sample user content.

## Preserved exceptions
The existing video component and global navigation retain their fonts, colors and motion. User instructions to preserve them take precedence over Hallmark's global token/overflow and autoplay rules. Tokens and clipping are scoped to these two pages, not html/body. Existing routes and APIs remain unchanged.

## Product correction
Blog, Resume, GitHub are three equally important job-preparation pillars. Restore GitHub in both primary navigation variants. Workspace is a personal hub; GitHub public activity stays distinct from backup configuration. Home explicitly names all three pillars.

## Exports

These are portability references, not additional runtime styles. This project remains on Tailwind 3. The production CSS stays scoped; do not paste these globally into protected pages.

### CSS

```css
/* LOGME tokens: compiled into the page CSS module, never imported globally. */
.root {
  --color-paper: oklch(99% 0.003 260);
  --color-surface: oklch(96.8% 0.005 260);
  --color-ink: oklch(23% 0.014 260);
  --color-muted: oklch(47% 0.016 260);
  --color-rule: oklch(88% 0.01 260);
  --color-control-rule: oklch(64% 0.015 260);
  --color-accent: oklch(46% 0.14 260);
  --color-accent-ink: oklch(99% 0.003 260);
  --color-selected: oklch(94% 0.022 260);
  --color-focus: oklch(46% 0.14 260);
  --color-danger: oklch(43% 0.15 25);
  --color-loading: oklch(89.5% 0.008 260);
  --font-body:
    -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic',
    sans-serif;
  --font-display: var(--font-body);
  --font-mono: ui-monospace, 'SFMono-Regular', monospace;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-micro: 120ms;
}
```

### Tailwind v4 (reference only)

```css
@theme {
  --color-paper: oklch(99% 0.003 260);
  --color-surface: oklch(96.8% 0.005 260);
  --color-ink: oklch(23% 0.014 260);
  --color-muted: oklch(47% 0.016 260);
  --color-rule: oklch(88% 0.01 260);
  --color-control-rule: oklch(64% 0.015 260);
  --color-accent: oklch(46% 0.14 260);
  --color-accent-ink: oklch(99% 0.003 260);
  --color-selected: oklch(94% 0.022 260);
  --color-focus: oklch(46% 0.14 260);
  --color-danger: oklch(43% 0.15 25);
  --color-loading: oklch(89.5% 0.008 260);
  --font-body: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  --font-display: var(--font-body);
  --font-mono: ui-monospace, 'SFMono-Regular', monospace;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  --spacing-3xl: 48px;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-micro: 120ms;
}
```

### Design token JSON

Font references and CSS values should be adapted to the target token pipeline.

```json
{
  "color": {
    "paper": {
      "$type": "color",
      "$value": "oklch(99% 0.003 260)"
    },
    "surface": {
      "$type": "color",
      "$value": "oklch(96.8% 0.005 260)"
    },
    "ink": {
      "$type": "color",
      "$value": "oklch(23% 0.014 260)"
    },
    "muted": {
      "$type": "color",
      "$value": "oklch(47% 0.016 260)"
    },
    "rule": {
      "$type": "color",
      "$value": "oklch(88% 0.01 260)"
    },
    "control-rule": {
      "$type": "color",
      "$value": "oklch(64% 0.015 260)"
    },
    "accent": {
      "$type": "color",
      "$value": "oklch(46% 0.14 260)"
    },
    "accent-ink": {
      "$type": "color",
      "$value": "oklch(99% 0.003 260)"
    },
    "selected": {
      "$type": "color",
      "$value": "oklch(94% 0.022 260)"
    },
    "focus": {
      "$type": "color",
      "$value": "oklch(46% 0.14 260)"
    },
    "danger": {
      "$type": "color",
      "$value": "oklch(43% 0.15 25)"
    },
    "loading": {
      "$type": "color",
      "$value": "oklch(89.5% 0.008 260)"
    }
  },
  "font": {
    "body": {
      "$type": "fontFamily",
      "$value": "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    },
    "display": {
      "$type": "fontFamily",
      "$value": "var(--font-body)"
    },
    "mono": {
      "$type": "fontFamily",
      "$value": "ui-monospace, 'SFMono-Regular', monospace"
    }
  },
  "space": {
    "xs": {
      "$type": "dimension",
      "$value": "4px"
    },
    "sm": {
      "$type": "dimension",
      "$value": "8px"
    },
    "md": {
      "$type": "dimension",
      "$value": "12px"
    },
    "lg": {
      "$type": "dimension",
      "$value": "16px"
    },
    "xl": {
      "$type": "dimension",
      "$value": "24px"
    },
    "2xl": {
      "$type": "dimension",
      "$value": "32px"
    },
    "3xl": {
      "$type": "dimension",
      "$value": "48px"
    }
  },
  "ease": {
    "out": {
      "$type": "cubicBezier",
      "$value": "cubic-bezier(0.16, 1, 0.3, 1)"
    }
  },
  "dur": {
    "micro": {
      "$type": "duration",
      "$value": "120ms"
    }
  }
}
```

### shadcn variable mapping (full CSS colors)

```css
.logme-scope {
  --background: oklch(99% 0.003 260);
  --foreground: oklch(23% 0.014 260);
  --card: oklch(96.8% 0.005 260);
  --card-foreground: oklch(23% 0.014 260);
  --popover: oklch(96.8% 0.005 260);
  --popover-foreground: oklch(23% 0.014 260);
  --primary: oklch(46% 0.14 260);
  --primary-foreground: oklch(99% 0.003 260);
  --secondary: oklch(94% 0.022 260);
  --secondary-foreground: oklch(23% 0.014 260);
  --muted: oklch(96.8% 0.005 260);
  --muted-foreground: oklch(47% 0.016 260);
  --accent: oklch(46% 0.14 260);
  --accent-foreground: oklch(99% 0.003 260);
  --destructive: oklch(43% 0.15 25);
  --destructive-foreground: oklch(99% 0.003 260);
  --border: oklch(88% 0.01 260);
  --input: oklch(64% 0.015 260);
  --ring: oklch(46% 0.14 260);
}
```

## Verification — 2026-09-13

Home and workspace visually inspected at 320, 375, 414, 768 and 1280px. Scoped text contrast exceeds 4.5:1; control border is 3.27:1. Loading, ready, empty and error layouts inspected with synthetic preview data; the live workspace currently shows account lookup failure, so populated API integration remains unverified. Live GitHub navigation reaches contribution and repository data. Isolated `next build` passed type checking, lint, compilation and page generation with existing warnings. Protected article/resume internals, APIs/hooks, video source/data/files and global layout/styles have no diff.

## Mobile spacing follow-up

Use a single 20px mobile gutter in Layout below the existing 1024px tablet breakpoint. Home/workspace, public profile, account and backup roots remove duplicate horizontal padding and extra mobile top spacing. Article detail and standalone editors keep their existing layout branches. Public-profile loading shares the introduction and post-row shapes; animation respects reduced-motion. Primary navigation labels use 블로그.
