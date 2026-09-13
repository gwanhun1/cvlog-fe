# LOGME — Hallmark design system

Scope: home and workspace only. Existing article list/detail, resume, global navigation, global layout and styles are preserved. Home feature videos, their files and interaction are preserved.

## Direction
Modern-minimal, compact writing utility. Keep LOGME blue as a small functional accent, with near-white surfaces and dark ink. Avoid promotional eyebrows, numbered feature triplets, large greeting banners, repeated cards and excessive vertical space.

## Page structure
- Home: product-led opening. Compact split heading/action block, existing live feature demo immediately beneath it, two concise secondary paths and inline footer. No extra fake screenshots or decorative chrome.
- Workspace: compact working index. A small navigation rail, primary draft and recent-record area, narrow utility column. No marketing enrichment. Row shapes also define skeleton geometry.

## Typography
Existing Korean-compatible system stack is deliberately preserved to avoid new remote font loading and changing other pages. 700 display, 400 body, 600 controls. Display max 44px on home; workspace title 24px. Roman headings, tight tracking, tabular dates. Native monospace only for the small LOGME label.

## Tokens
`styles/logmeDesign.module.scss` is the scoped source of truth. Named ink, muted, surface, rule, accent, focus, danger, loading and spacing tokens. No global CSS changes. Focus is immediate; links/buttons have 44px touch targets. No page reveal animation; existing video behavior is preserved. Skeleton uses restrained opacity animation and stops with reduced-motion.

## Layout
Desktop home intro uses an asymmetric split. Desktop workspace rail is 152px and main content grows; secondary utility column is 240px when space allows. At 768px utilities become a compact row; at phone widths they stack. Page padding is 12–16px on phone. Sections use 16–24px gaps; rows 12px internal padding. No forced full-viewport height.

## States
Initial identity, draft, recent-post, resume, and backup loading each have shape-matched skeletons. Data errors are distinct from empty data. Existing account API can return null; keep the retry state. Background refresh retains readable data. No invented counts or sample user content.

## Preserved exceptions
The existing video component and global navigation retain their fonts, colors and motion. User instructions to preserve them take precedence over Hallmark's global token/overflow and autoplay rules. Tokens and clipping are scoped to these two pages, not html/body. Existing routes and APIs remain unchanged.

## Product correction
Blog, Resume, GitHub are three equally important job-preparation pillars. Restore GitHub in both primary navigation variants. Workspace is a personal hub; GitHub public activity stays distinct from backup configuration. Home explicitly names all three pillars.
