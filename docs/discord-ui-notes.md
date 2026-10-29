# Discord UI notes (desktop and mobile, 2025 visual refresh)

Reference for this theme. Values were read from Discord's live web client stylesheets on
2026-10-28 (token names are stable; hashed class names change every build), cross-checked with
Discord's blog posts on the mobile redesign and the 2025 refresh. **[CSS]** = read from Discord's
CSS, **[web]** = a published source, **[est]** = estimated from screenshots.

## Themes

Discord's picker has Light, Ash, Dark and Onyx. In the CSS they are `.theme-light`,
`.theme-dark` (Ash, the old dark), `.theme-darker` (Dark, the default dark since 2025) and
`.theme-midnight` (Onyx). The refresh itself is `.visual-refresh` on the root. [CSS, web]

## Layout (desktop)

- Grid: a title bar across the top, then the server rail, the channel list and the page.
- Title bar: 32px (24 small, 40 large), padding 0 12px, the place's name centred, inbox and help
  at the right. [CSS]
- Server rail: icons 44px (40 compact), rail width = icon + 2 × 16px = 76px; no background of its
  own (it sits on base-lowest). Separator 32×1px. Server icons are squircles (≈12px radius at
  44px) and grow slightly on hover; people stay circles. Placeholder icons sit on mod-subtle and
  turn brand-blurple when hovered or picked. [CSS]
- Pill: 8px wide, radius 0 4px 4px 0, text-strong; 8px unread, 20px hover, 40px picked;
  transition .2s ease-out. [CSS]
- Channel list: base-lower, 1px app-frame border on its top and left, 12px top-left radius;
  header 49px with a 1px border-subtle bottom; rows radius 8px, 24px line, 20px icons. [CSS]
- User panel: floats over the bottom of rail + list, 8px from the edges, base-low, 1px
  border-muted, radius 8px, ≈56px tall with a 32px avatar. [CSS, est]
- Chat: content base-lower; header 49px; member list 264px (256 compact, 268 cozy) with a 1px
  border-subtle left edge; DM profile panel 340px, banner 105px. [CSS]
- Messages: 40px avatar 16px from the left, content at 72px, 0.125rem padding, group start
  ≈17px above. [CSS, est]
- Composer: 8px below, 1px border-muted, radius 8px, chat-background-default; ≈56px tall; 20px
  icons; textarea padding 12px 10px. [CSS]
- Spacing scale (default): 8 / 12 / 16 / 20 / 24 / 32. Radii: 4 / 8 / 12 / 16 / 24 / 32. [CSS]

## Colours

| Token | Ash | Dark | Onyx | Light |
|---|---|---|---|---|
| background-base-lowest (title bar, rail) | #2c2d32 | #121214 | #000000 | #f3f3f4 |
| background-base-lower (list, chat, members) | #323339 | #1a1a1e | #000000 | #fbfbfb |
| background-base-low (user panel) | #36373e | #202024 | #000000 | #fbfbfb |
| background-surface-high (modal, tooltip, popout) | #393a41 | #242429 | #0a0a0c | #ffffff |
| background-surface-higher (context menu) | #3c3d45 | #28282d | #121214 | #ffffff |
| background-surface-highest (hover bar) | #3f4048 | #2c2d32 | #17181b | #ffffff |
| chat-background-default (composer) | #393a41 | #222327 | #101013 | #ffffff |
| app-frame-background | #25262a | #070709 | #000000 | #e8e8ea |
| text-strong | #ffffff | #fbfbfb | #dcdcdf | #28282d |
| text-default | #f3f3f4 | #efeff1 | #d4d5d8 | #2e2e34 |
| text-subtle (interactive normal) | #c5c6ca | #abacb2 | #96979e | #595a63 |
| text-muted | #abacb2 | #96979e | #81828a | #6c6d76 |
| channels-default | #999aa1 | #81828a | #7a7b83 | #666770 |
| text-link | #76aff6 | #4d96ee | #2781e7 | #006dd4 |
| scrollbar thumb | #7d7e87 | #666770 | #595a63 | #8f9097 |
| slider track | #595a63 | #474851 | #383940 | #c5c6ca |
| text-feedback-critical | #ffa09b | #f87e7a | #eb5f5e | #b92733 |

Overlays are one grey, #97979f, at different strengths: mod-subtle (hover, message hover) 12%,
mod-normal (active) 16% (Onyx 20%), mod-strong (selected) 20% (Onyx and Light 24%);
border-subtle 12% (Onyx 20%, Light 28%), border-normal 20% (Onyx 24%, Light 40%),
border-muted 4% (Onyx 16%, Light 20%). [CSS]

- Brand #5865f2, hover #4452bb, active #3a48a3. Secondary button = mod-subtle background,
  text-strong, 1px border-muted. Danger #d22d39 (hover #a9232e). [CSS]
- Status: online #3d9e60 (light #01783e), idle #ffcb6e, dnd #dc4247, offline #9d9ea5. [CSS]
- Inputs: #000 at 8% (Ash) / 12% (Dark, Onyx) / 2% (Light), 1px border-normal, focus text-link.
- Switch: off #000 at 12% with a #97979f 20% border; on brand blurple; white thumb.
- Shadows: high 0 12px 24px rgba(0,0,0,.24); low 0 1px 4px rgba(0,0,0,.14). Scrim #000 72%
  (light 52%). [CSS]

## Type

- gg sans, then "Noto Sans", "Helvetica Neue", Helvetica, Arial; code: gg mono, Source Code Pro.
- Message 16px / 22px, 400, text-default; name 16px 500 text-strong; time 12px 500 muted, 4px
  after the name; hover/compact time 11px in a 56px gutter. [CSS]
- Section labels 12px 600 uppercase; tooltips 14px 500 / 16px; menu items 14px 500; buttons
  14px 500 / 16px; settings titles 20px 600; quick switcher input 22px. [CSS, est]

## Components

- Tooltip: surface-high, 1px border-subtle, radius 8px, shadow-high, padding 8px 12px, max 190px,
  14px 500, text-default, 5px arrow. [CSS]
- Context menu: surface-higher, 1px border-subtle, radius 8px, padding 8px, min 188px (220px
  classic); items 32px min, padding 8px, radius 4px, hover mod-subtle with text-strong
  (no longer blurple); danger items critical text with a #d22d39 8% hover; separators 1px
  border-subtle, 8px margin. [CSS]
- Modal: 442 / 602 / 800px, surface-high, 1px border-normal, radius 12px, padding 16px 24px, no
  grey footer; close icon at 50% opacity. [CSS]
- Settings: items padding 6px 10px, radius 4px, 2px apart, text-subtle → text-strong on hover,
  selected mod-strong; close: 36px circle, 2px border, "ESC" 6px under it; classic layout 218px
  sidebar, 740px content, padding 60px 40px 80px. [CSS, est]
- Inputs 44px (new controls 40 / 32px), padding 12px 10px, 16px, radius 8px. Select min 40px.
  Search 32px, radius 8px. [CSS]
- Slider: 8px track, radius 4px, brand fill, 10×24px white grabber, radius 3px. [CSS]
- Buttons: radius 8px; small 32px (min 60px wide), medium 40px (min 100px). [CSS]
- Friends bar: pill tabs, 32px, padding 4px 12px, radius 8px, selected mod-strong; Add Friend is a
  filled blurple pill; Active Now column 360–420px. [CSS]
- Profile popout: 300px, radius 8px, banner 105px, 80px avatar with a 6px ring. [CSS, est]
- Message hover bar: 32px, surface-highest, radius 4px (8px in the refresh), border + low
  shadow, 32px cells, ≈ top −16px right 14px. [CSS, est]
- Editing: inline box with "escape to cancel • enter to save" under it, 12px. [est]
- Quick switcher: ≈570px, padding 12px 20px 0, radius 8px, input 70px tall, 22px. [CSS, est]
- Notices / toasts: surface-high, 1px border-subtle, radius 16px, padding 12px. [CSS]

## Nitro color themes

Discord's client defines 24 gradient themes (Mint Apple to Blurple Twilight, plus Hexagon): stops, angle, a light or dark base and two tints. The app background is the gradient, fixed to the window; each surface tier (frame, list, chat, panels) is a translucent veil of the base theme's colour over it, so the gradient runs on unbroken. Surface tokens mix 50% of the base tint into the base theme's colours, text tokens 38% of the text tint (oklab). Dark presets sit on Ash, light ones on Light. The values are in nitro.js. [CSS, JS, web]

## Mobile

- Bottom tabs: Home (server rail beside DMs or channels), Notifications, You. [web, est]
- Rail items 48px; servers squircles, people circles. [CSS, web]
- Composer: rounded rectangle (radius 8px, no longer a pill), 1px border, 8px side margin;
  32px buttons with 20px icons, 32×32 send; emoji, gift and voice message on the right; threads
  and apps under +. [CSS, web]
- Settings: grouped rows 56px tall, group radius 12px, text-md medium, chevrons. Switch 56×28.

## Icons

Discord's icons (2023+) are solid filled shapes on a 24px grid with rounded joins, drawn in
currentColor: sizes 12 / 16 / 18 / 24 / 32, 20px in the composer. [CSS] Friends is a waving
figure, Nitro a wheel badge, Shop a storefront with an awning, Discover a compass, threads a
bubble, GIF a rounded box with "GIF", sticker a peeled square, reply a curved arrow. [est]

## Sources

- Discord web client stylesheets (discord.com/app and its /assets/*.css), read 2026-10-28.
- https://discord.com/blog/improving-mobile-with-squircles-styles-and-spacing
- https://discord.com/blog/improving-our-mobile-experience
- https://support.discord.com/hc/da/community/posts/30925961190679
- https://raw.githubusercontent.com/refact0r/midnight-discord/master/build/midnight.css (variable names)
