# Discord design reference

Measured notes on Discord's web client, taken on 2026-10-29 from the client's stylesheets (300 files saved locally, not committed) and, for the gradient presets, from the main client script. Everything here is written out as values and descriptions; no rules or artwork are copied. Values were extracted with scripts that flatten the stylesheets and resolve `var()` chains, so token values are exact for the build captured. Where a value was inferred rather than read, it says so.

Theme names: Discord's 2025 settings call the four base themes **Light**, **Ash**, **Dark** and **Onyx**. In the markup they are the root classes `.theme-light`, `.theme-dark` (Ash), `.theme-darker` (Dark) and `.theme-midnight` (Onyx).

Colour notation: `#rrggbb` is opaque; `#rrggbb @ n%` is that colour at n% alpha. Alpha tokens such as the `--background-mod-*`, `--border-*` and `--interactive-background-*` families are a grey (#97979f) or black/white at an alpha, so they read correctly over any surface.

## 1. Theme tokens

### How the tokens are built

Primitive palettes (`--neutral-*`, `--blurple-*`, `--plum-*`, `--red-new-*` and so on) sit on `:root`; `.visual-refresh` maps the older names (`--brand-*`, `--primary-*`, `--blue-*` …) onto them. Each theme class then assigns the semantic tokens below to primitives. A second copy of every colour token, used whenever the browser supports `color-mix()`, wraps the same value in a mix with the custom-theme tint at 0% (see section 2); with no custom theme active both copies give the same colour, which is what the table shows. High-contrast mode (`.high-contrast-mode`) overrides about 200 of these per theme and is not tabulated here.

### Semantic tokens per theme

One row per custom property defined by a theme class (`-hsl` channel triplets omitted; they mirror the colour rows). "—" means the theme does not define it.

| Property | Light | Ash | Dark | Onyx |
|---|---|---|---|---|
| `--ansi-black` | #000000 | #000000 | #000000 | #000000 |
| `--ansi-blue` | #3789ea | #4591ec | #1a7ce6 | #0268ca |
| `--ansi-bright-black` | #70717a | #70717a | #70717a | #70717a |
| `--ansi-bright-blue` | #5865f2 | #a0a9fa | #5865f2 | #5865f2 |
| `--ansi-bright-cyan` | #007782 | #5fbfc8 | #2fa9b3 | #0096a1 |
| `--ansi-bright-green` | #108e4d | #21bb63 | #21bb63 | #108e4d |
| `--ansi-bright-magenta` | #b3269c | #fd99e9 | #ff4cd2 | #ff4cd2 |
| `--ansi-bright-red` | #ca2b37 | #ff938e | #f47470 | #e55455 |
| `--ansi-bright-white` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--ansi-bright-yellow` | #db6e00 | #e79418 | #e79418 | #db6e00 |
| `--ansi-cyan` | #0098a3 | #049faa | #008995 | #00757f |
| `--ansi-green` | #399b5d | #45a366 | #1b8d4d | #017b40 |
| `--ansi-magenta` | #e444bb | #f549c9 | #d53fae | #b73495 |
| `--ansi-red` | #e75858 | #ec6361 | #de464a | #ca2b37 |
| `--ansi-white` | #b6b7bc | #b6b7bc | #b6b7bc | #b6b7bc |
| `--ansi-yellow` | #c07600 | #ce8100 | #b36c00 | #9d5a00 |
| `--app-frame-background` | #e8e8ea | #25262a | #070709 | #000000 |
| `--app-frame-border` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--app-message-embed-secondary-text` | #ffffff @ 70% | #ffffff @ 70% | #ffffff @ 70% | #ffffff @ 70% |
| `--background-accent` | #6c6d76 | #41424a | #393a41 | #2c2d32 |
| `--background-base-low` | #fbfbfb | #36373e | #202024 | #000000 |
| `--background-base-lower` | #fbfbfb | #323339 | #1a1a1e | #000000 |
| `--background-base-lowest` | #f3f3f4 | #2c2d32 | #121214 | #000000 |
| `--background-brand` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--background-code` | #5865f2 @ 3.9% | #5865f2 @ 7.8% | #5865f2 @ 7.8% | #5865f2 @ 7.8% |
| `--background-code-addition` | #008545 @ 12.2% | #008545 @ 12.2% | #008545 @ 12.2% | #008545 @ 12.2% |
| `--background-code-deletion` | #d22d39 @ 12.2% | #d22d39 @ 12.2% | #d22d39 @ 12.2% | #d22d39 @ 12.2% |
| `--background-feedback-critical` | #d22d39 @ 7.8% | #d22d39 @ 7.8% | #d22d39 @ 7.8% | #d22d39 @ 7.8% |
| `--background-feedback-info` | #0074e3 @ 7.8% | #0074e3 @ 7.8% | #0074e3 @ 7.8% | #0074e3 @ 7.8% |
| `--background-feedback-notification` | #d22d39 | #d22d39 | #d22d39 | #d22d39 |
| `--background-feedback-positive` | #008545 @ 7.8% | #008545 @ 7.8% | #008545 @ 7.8% | #008545 @ 7.8% |
| `--background-feedback-warning` | #f8a300 @ 7.8% | #f8a300 @ 7.8% | #f8a300 @ 7.8% | #f8a300 @ 7.8% |
| `--background-mod-muted` | #97979f @ 7.8% | #97979f @ 7.8% | #97979f @ 7.8% | #97979f @ 7.8% |
| `--background-mod-normal` | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 20% |
| `--background-mod-strong` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--background-mod-subtle` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--background-scrim` | #000000 @ 52.2% | #000000 @ 72.2% | #000000 @ 72.2% | #000000 @ 72.2% |
| `--background-scrim-lightbox` | #000000 @ 92.2% | #000000 @ 92.2% | #000000 @ 92.2% | #000000 @ 92.2% |
| `--background-secondary-alt` | #ebeced | #242429 | #393a41 | #2c2d32 |
| `--background-surface-high` | #ffffff | #393a41 | #242429 | #0a0a0c |
| `--background-surface-higher` | #ffffff | #3c3d45 | #28282d | #121214 |
| `--background-surface-highest` | #ffffff | #3f4048 | #2c2d32 | #17181b |
| `--background-tile-gradient-pink-end` | #fd99e9 @ 30% | #660066 @ 30% | #660066 @ 30% | #660066 @ 30% |
| `--background-tile-gradient-pink-start` | #fbe6ff @ 30% | #b3269c @ 30% | #b3269c @ 30% | #b3269c @ 30% |
| `--background-voice-muted` | #d22d39 @ 12.2% | #d22d39 @ 12.2% | #d22d39 @ 12.2% | #d22d39 @ 12.2% |
| `--badge-common-background` | #97979f @ 23.9% | #97979f @ 23.9% | #97979f @ 23.9% | #97979f @ 23.9% |
| `--badge-common-border` | #81828a | #81828a | #81828a | #81828a |
| `--badge-common-text` | #5f606a | #c9cace | #c9cace | #c9cace |
| `--badge-critical-background` | #d22d39 | #d22d39 | #d22d39 | #d22d39 |
| `--badge-critical-border` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--badge-critical-text` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--badge-epic-background` | #a056f2 @ 24% | #a056f2 @ 24% | #a056f2 @ 24% | #a056f2 @ 24% |
| `--badge-epic-border-gradient-end` | #a056f2 | #a056f2 | #a056f2 | #a056f2 |
| `--badge-epic-border-gradient-start` | #ff4cd2 | #ff4cd2 | #ff4cd2 | #ff4cd2 |
| `--badge-epic-text` | #612caf | #ca9ef9 | #ca9ef9 | #ca9ef9 |
| `--badge-expressive-background` | #5865f2 | #ffffff | #ffffff | #ffffff |
| `--badge-expressive-border` | #5865f2 | #ffffff | #ffffff | #ffffff |
| `--badge-expressive-text` | #ffffff | #2f3035 | #2f3035 | #2f3035 |
| `--badge-inverted-background` | #000000 | #ffffff | #ffffff | #ffffff |
| `--badge-inverted-border` | #000000 | #ffffff | #ffffff | #ffffff |
| `--badge-inverted-text` | #ffffff | #000000 | #000000 | #000000 |
| `--badge-mythic-background` | #fe6e0d @ 24% | #fe6e0d @ 24% | #fe6e0d @ 24% | #fe6e0d @ 24% |
| `--badge-mythic-border-gradient-end` | #fe6e0d | #fe6e0d | #fe6e0d | #fe6e0d |
| `--badge-mythic-border-gradient-start` | #ffe047 | #ffe047 | #ffe047 | #ffe047 |
| `--badge-mythic-text` | #f25e0c | #fe9242 | #fe9242 | #fe9242 |
| `--badge-notification-background` | #d22d39 | #d22d39 | #d22d39 | #d22d39 |
| `--badge-notification-border` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--badge-notification-text` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--badge-premium-background-gradient-end` | #ab5d8a | #ab5d8a | #ab5d8a | #ab5d8a |
| `--badge-premium-background-gradient-mid` | #b845c1 | #b845c1 | #b845c1 | #b845c1 |
| `--badge-premium-background-gradient-start` | #8547c6 | #8547c6 | #8547c6 | #8547c6 |
| `--badge-premium-text` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--badge-primary-background` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--badge-primary-border` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--badge-primary-text` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--badge-rare-background` | #5865f2 @ 24% | #5865f2 @ 24% | #5865f2 @ 24% | #5865f2 @ 24% |
| `--badge-rare-border-gradient-end` | #2d35ad | #2d35ad | #2d35ad | #2d35ad |
| `--badge-rare-border-gradient-start` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--badge-rare-text` | #2d35ad | #a0a9fa | #a0a9fa | #a0a9fa |
| `--badge-secondary-background` | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 20% |
| `--badge-secondary-border` | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 20% |
| `--badge-secondary-text` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--badge-success-background` | #008545 | #008545 | #008545 | #008545 |
| `--badge-success-border` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--badge-success-text` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--badge-warning-background` | #faaa00 | #faaa00 | #faaa00 | #faaa00 |
| `--badge-warning-border` | #000000 @ 7.8% | #000000 @ 7.8% | #000000 @ 7.8% | #000000 @ 7.8% |
| `--badge-warning-text` | #000000 | #000000 | #000000 | #000000 |
| `--bg-surface-raised` | #ffffff | #393a41 | #27272c | #131416 |
| `--border-feedback-critical` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--border-feedback-info` | #0361bc | #8ebefa | #66a5f3 | #4591ec |
| `--border-feedback-positive` | #01713a | #7ecb94 | #5eb479 | #41a063 |
| `--border-feedback-warning` | #945300 | #fcb529 | #ea9800 | #ce8100 |
| `--border-focus` | #408eec | #6aa8f4 | #6aa8f4 | #6aa8f4 |
| `--border-muted` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--border-normal` | #97979f @ 40% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--border-strong` | #97979f @ 52.2% | #97979f @ 43.9% | #97979f @ 43.9% | #97979f @ 43.9% |
| `--border-subtle` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--border-voice-muted` | #d22d39 @ 12.2% | #d22d39 @ 12.2% | #d22d39 @ 12.2% | #d22d39 @ 12.2% |
| `--brightness` | 1 | 1 | — | — |
| `--button-danger-background-disabled` | #d22d39 | #d22d39 | #d22d39 | #d22d39 |
| `--button-outline-brand-background-hover` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--button-outline-brand-border-active` | #4654c0 | #4654c0 | #4654c0 | #4654c0 |
| `--button-outline-primary-text` | #000000 | #ffffff | #ffffff | #ffffff |
| `--card-background-default` | #ffffff | #393a41 | #242429 | #0a0a0c |
| `--card-border-default` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--card-primary-pressed-bg` | #ebeced | #292a2f | #222327 | #0c0c0e |
| `--card-secondary-bg` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--card-secondary-pressed-bg` | #ebeced | #292a2f | #1a1a1e | #070709 |
| `--channel-background-default` | #fbfbfb | #323339 | #1a1a1e | #000000 |
| `--channel-icon` | #666770 | #999aa1 | #81828a | #7a7b83 |
| `--channel-text-area-placeholder` | #84858d | #6c6d76 | #6c6d76 | #6c6d76 |
| `--channels-default` | #666770 | #999aa1 | #81828a | #7a7b83 |
| `--channeltextarea-background` | #ebeced | #393a41 | #393a41 | #131416 |
| `--chart-brand` | #5865f2 | #6374f4 | #5865f2 | #5865f2 |
| `--chart-categorical-1` | #5865f2 | #6374f4 | #5865f2 | #5865f2 |
| `--chart-categorical-10` | #9d5a00 | #9d5a00 | #9d5a00 | #9d5a00 |
| `--chart-categorical-2` | #fe9242 | #fe9242 | #fe9242 | #fe9242 |
| `--chart-categorical-3` | #a056f2 | #a056f2 | #a056f2 | #a056f2 |
| `--chart-categorical-4` | #47b3bc | #47b3bc | #47b3bc | #47b3bc |
| `--chart-categorical-5` | #62b77c | #62b77c | #62b77c | #62b77c |
| `--chart-categorical-6` | #d53fae | #d53fae | #d53fae | #d53fae |
| `--chart-categorical-7` | #febd45 | #febd45 | #febd45 | #febd45 |
| `--chart-categorical-8` | #dc4247 | #dc4247 | #dc4247 | #dc4247 |
| `--chart-categorical-9` | #00468a | #00468a | #00468a | #00468a |
| `--chart-mono-1` | #e6eaff | #b6c5ff | #b6c5ff | #b6c5ff |
| `--chart-mono-2` | #b6c5ff | #899dfd | #899dfd | #899dfd |
| `--chart-mono-3` | #899dfd | #5865f2 | #5865f2 | #5865f2 |
| `--chart-mono-4` | #5865f2 | #3e4cad | #3e4cad | #3e4cad |
| `--chart-mono-5` | #4452bb | #273478 | #273478 | #273478 |
| `--chart-mono-6` | #2e3c88 | #152250 | #152250 | #152250 |
| `--chart-mono-7` | #182557 | #060f29 | #060f29 | #060f29 |
| `--chart-mono-text-1` | #35363c | #1b1c1f | #1b1c1f | #1b1c1f |
| `--chart-mono-text-2` | #1b1c1f | #000000 | #000000 | #000000 |
| `--chart-mono-text-3` | #000000 | #ffffff | #ffffff | #ffffff |
| `--chart-mono-text-4` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--chart-mono-text-5` | #ffffff | #f3f3f4 | #f3f3f4 | #f3f3f4 |
| `--chart-mono-text-6` | #ffffff | #d1d1d5 | #d1d1d5 | #d1d1d5 |
| `--chart-mono-text-7` | #d4d5d8 | #bebec3 | #bebec3 | #bebec3 |
| `--chart-negative` | #d22d39 | #e55455 | #d22d39 | #d22d39 |
| `--chart-neutral` | #96979e | #96979e | #96979e | #96979e |
| `--chart-positive` | #62b77c | #62b77c | #62b77c | #62b77c |
| `--chat-background` | #ffffff | #323339 | #323339 | #000000 |
| `--chat-background-default` | #ffffff | #393a41 | #222327 | #101013 |
| `--chat-border` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--chat-text-muted` | #70717a | #9d9ea5 | #81828a | #73747d |
| `--checkbox-background-active` | #3a48a3 | #3a48a3 | #3a48a3 | #3a48a3 |
| `--checkbox-background-default` | #000000 @ 3.9% | #000000 @ 7.8% | #000000 @ 7.8% | #000000 @ 7.8% |
| `--checkbox-background-hover` | #000000 @ 3.9% | #000000 @ 7.8% | #000000 @ 7.8% | #000000 @ 7.8% |
| `--checkbox-background-selected-default` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--checkbox-background-selected-hover` | #4452bb | #4452bb | #4452bb | #4452bb |
| `--checkbox-border-active` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--checkbox-border-default` | #84858d | #97979f @ 63.9% | #97979f @ 63.9% | #97979f @ 63.9% |
| `--checkbox-border-hover` | #5c5d67 | #97979f @ 80% | #97979f @ 80% | #97979f @ 80% |
| `--checkbox-border-selected-default` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--checkbox-border-selected-hover` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--checkbox-icon-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--chip-blurple-dark-background` | #303e8d | #303e8d | #303e8d | #303e8d |
| `--chip-blurple-dark-text` | #e6eaff | #e6eaff | #e6eaff | #e6eaff |
| `--chip-blurple-light-background` | #a6b8ff | #a6b8ff | #a6b8ff | #a6b8ff |
| `--chip-blurple-light-text` | #0c173a | #0c173a | #0c173a | #0c173a |
| `--chip-gray-dark-background` | #292a2f | #292a2f | #292a2f | #292a2f |
| `--chip-gray-dark-text` | #ebeced | #ebeced | #ebeced | #ebeced |
| `--chip-gray-light-background` | #dcdcdf | #dcdcdf | #dcdcdf | #dcdcdf |
| `--chip-gray-light-text` | #34343a | #34343a | #34343a | #34343a |
| `--chip-gray-medium-background` | #70717a | #70717a | #70717a | #70717a |
| `--chip-gray-medium-text` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--chip-green-dark-background` | #005428 | #005428 | #005428 | #005428 |
| `--chip-green-dark-text` | #c8ffd8 | #c8ffd8 | #c8ffd8 | #c8ffd8 |
| `--chip-green-light-background` | #84d09a | #84d09a | #84d09a | #84d09a |
| `--chip-green-light-text` | #00250a | #00250a | #00250a | #00250a |
| `--chip-orange-light-background` | #f2a87d | #f2a87d | #f2a87d | #f2a87d |
| `--chip-orange-light-text` | #370200 | #370200 | #370200 | #370200 |
| `--chip-red-dark-background` | #851621 | #851621 | #851621 | #851621 |
| `--chip-red-dark-text` | #ffdedd | #ffdedd | #ffdedd | #ffdedd |
| `--chip-red-light-background` | #ff9a94 | #ff9a94 | #ff9a94 | #ff9a94 |
| `--chip-red-light-text` | #320007 | #320007 | #320007 | #320007 |
| `--chip-yellow-light-background` | #ffce76 | #ffce76 | #ffce76 | #ffce76 |
| `--chip-yellow-light-text` | #562000 | #562000 | #562000 | #562000 |
| `--collectibles-tab-gradient-center` | #72adf5 | #72adf5 | #72adf5 | #72adf5 |
| `--collectibles-tab-gradient-inner` | #a056f2 @ 25% | #a056f2 @ 25% | #a056f2 @ 25% | #a056f2 @ 25% |
| `--collectibles-tab-gradient-orange-center` | #f25e0c | #f25e0c | #f25e0c | #f25e0c |
| `--collectibles-tab-gradient-orange-inner` | #bd2934 @ 50% | #bd2934 @ 50% | #bd2934 @ 50% | #bd2934 @ 50% |
| `--collectibles-tab-gradient-orange-outer` | #851621 @ 0% | #851621 @ 0% | #851621 @ 0% | #851621 @ 0% |
| `--collectibles-tab-gradient-outer` | #0074e3 @ 0% | #0074e3 @ 0% | #0074e3 @ 0% | #2d35ad @ 0% |
| `--content-inventory-media-seekbar-container` | #c9cace @ 24% | #c9cace @ 24% | #c9cace @ 24% | #c9cace @ 24% |
| `--content-inventory-overlay-text-primary` | #ffffff @ 85% | #ffffff @ 85% | #ffffff @ 85% | #ffffff @ 85% |
| `--content-inventory-overlay-text-secondary` | #ffffff @ 70% | #ffffff @ 70% | #ffffff @ 70% | #ffffff @ 70% |
| `--context-menu-backdrop-background` | #000000 @ 52.2% | #000000 @ 72.2% | #000000 @ 72.2% | #000000 @ 70% |
| `--contrast` | 1 | 1 | — | — |
| `--control-brand-foreground` | #5865f2 | #8ca0fd | #8ca0fd | #8ca0fd |
| `--control-brand-foreground-new` | #5865f2 | #8ca0fd | #8ca0fd | #8ca0fd |
| `--control-connected-background-active` | #005f30 | #005f30 | #005f30 | #005f30 |
| `--control-connected-background-default` | #008545 | #008545 | #008545 | #008545 |
| `--control-connected-background-hover` | #006c37 | #006c37 | #006c37 | #006c37 |
| `--control-connected-border-active` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-connected-border-default` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-connected-border-hover` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-connected-icon-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-connected-icon-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-connected-icon-hover` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-connected-text-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-connected-text-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-connected-text-hover` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-critical-primary-background-active` | #971d28 | #971d28 | #971d28 | #971d28 |
| `--control-critical-primary-background-default` | #d22d39 | #d22d39 | #d22d39 | #d22d39 |
| `--control-critical-primary-background-hover` | #a9232e | #a9232e | #a9232e | #a9232e |
| `--control-critical-primary-border-active` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-critical-primary-border-default` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-critical-primary-border-hover` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-critical-primary-icon-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-critical-primary-icon-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-critical-primary-icon-hover` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-critical-primary-text-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-critical-primary-text-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-critical-primary-text-hover` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-critical-secondary-background-active` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--control-critical-secondary-background-default` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--control-critical-secondary-background-hover` | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 20% |
| `--control-critical-secondary-border-active` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-critical-secondary-border-default` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-critical-secondary-border-hover` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-critical-secondary-icon-active` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--control-critical-secondary-icon-default` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--control-critical-secondary-icon-hover` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--control-critical-secondary-text-active` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--control-critical-secondary-text-default` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--control-critical-secondary-text-hover` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--control-expressive-background-active` | #3a48a3 | #efeff1 | #efeff1 | #efeff1 |
| `--control-expressive-background-default` | #5865f2 | #ffffff | #ffffff | #ffffff |
| `--control-expressive-background-hover` | #4452bb | #ffffff | #ffffff | #ffffff |
| `--control-expressive-border-active` | #ffffff @ 7.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--control-expressive-border-default` | #ffffff @ 7.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--control-expressive-border-hover` | #ffffff @ 7.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--control-expressive-icon-active` | #ffffff | #000000 | #000000 | #000000 |
| `--control-expressive-icon-default` | #ffffff | #000000 | #000000 | #000000 |
| `--control-expressive-icon-hover` | #ffffff | #000000 | #000000 | #000000 |
| `--control-expressive-text-active` | #ffffff | #000000 | #000000 | #000000 |
| `--control-expressive-text-default` | #ffffff | #000000 | #000000 | #000000 |
| `--control-expressive-text-hover` | #ffffff | #000000 | #000000 | #000000 |
| `--control-icon-only-background-active` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--control-icon-only-background-hover` | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 20% |
| `--control-icon-only-border-active` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-icon-only-border-hover` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-icon-only-icon-active` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--control-icon-only-icon-default` | #595a63 | #c5c6ca | #abacb2 | #96979e |
| `--control-icon-only-icon-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--control-overlay-primary-background-active` | #c2c2c7 | #c2c2c7 | #c2c2c7 | #c2c2c7 |
| `--control-overlay-primary-background-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-overlay-primary-background-hover` | #e0e0e3 | #e0e0e3 | #e0e0e3 | #e0e0e3 |
| `--control-overlay-primary-border-active` | #ffffff @ 7.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--control-overlay-primary-border-default` | #ffffff @ 7.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--control-overlay-primary-border-hover` | #ffffff @ 7.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--control-overlay-primary-icon-active` | #000000 | #000000 | #000000 | #000000 |
| `--control-overlay-primary-icon-default` | #000000 | #000000 | #000000 | #000000 |
| `--control-overlay-primary-icon-hover` | #000000 | #000000 | #000000 | #000000 |
| `--control-overlay-primary-text-active` | #000000 | #000000 | #000000 | #000000 |
| `--control-overlay-primary-text-default` | #000000 | #000000 | #000000 | #000000 |
| `--control-overlay-primary-text-hover` | #000000 | #000000 | #000000 | #000000 |
| `--control-overlay-secondary-background-active` | #000000 @ 56.1% | #000000 @ 56.1% | #000000 @ 56.1% | #000000 @ 56.1% |
| `--control-overlay-secondary-background-default` | #000000 @ 56.1% | #000000 @ 56.1% | #000000 @ 56.1% | #000000 @ 56.1% |
| `--control-overlay-secondary-background-hover` | #000000 @ 63.9% | #000000 @ 63.9% | #000000 @ 63.9% | #000000 @ 63.9% |
| `--control-overlay-secondary-border-active` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-overlay-secondary-border-default` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-overlay-secondary-border-hover` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-overlay-secondary-icon-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-overlay-secondary-icon-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-overlay-secondary-icon-hover` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-overlay-secondary-text-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-overlay-secondary-text-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-overlay-secondary-text-hover` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-primary-background-active` | #3a48a3 | #3a48a3 | #3a48a3 | #3a48a3 |
| `--control-primary-background-default` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--control-primary-background-hover` | #4452bb | #4452bb | #4452bb | #4452bb |
| `--control-primary-border-active` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-primary-border-default` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-primary-border-hover` | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 7.8% |
| `--control-primary-icon-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-primary-icon-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-primary-icon-hover` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-primary-text-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-primary-text-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-primary-text-hover` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--control-secondary-background-active` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--control-secondary-background-default` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--control-secondary-background-hover` | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 20% |
| `--control-secondary-border-active` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-secondary-border-default` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-secondary-border-hover` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--control-secondary-icon-active` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--control-secondary-icon-default` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--control-secondary-icon-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--control-secondary-text-active` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--control-secondary-text-default` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--control-secondary-text-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--creator-revenue-icon-gradient-end` | #00919d | #007c87 | #007c87 | #007c87 |
| `--creator-revenue-icon-gradient-start` | #3caeb8 | #15a2ac | #15a2ac | #15a2ac |
| `--creator-revenue-info-box-background` | #007c87 @ 10% | #007c87 @ 10% | #007c87 @ 10% | #007c87 @ 10% |
| `--creator-revenue-info-box-border` | #00919d | #00919d | #00919d | #00919d |
| `--creator-revenue-locked-channel-icon` | #00919d | #3caeb8 | #3caeb8 | #3caeb8 |
| `--creator-revenue-progress-bar` | #3caeb8 | #00919d | #00919d | #00919d |
| `--datepicker-range-background-default` | #5865f2 @ 40% | #5865f2 @ 40% | #5865f2 @ 40% | #5865f2 @ 40% |
| `--datepicker-range-background-hover` | #5865f2 @ 60% | #5865f2 @ 60% | #5865f2 @ 60% | #5865f2 @ 60% |
| `--elevation-high` | 0 8px 16px #000000 @ 16.1% | 0 8px 16px #000000 @ 23.9% | — | — |
| `--elevation-low` | 0 1px 0 #000000 @ 12.2%,0 1.5px 0 #000000 @ 3.9%,0 2px 0 #000000 @ 3.9% | 0 1px 0 #000000 @ 20%,0 1.5px 0 #000000 @ 3.9%,0 2px 0 #000000 @ 3.9% | — | — |
| `--elevation-medium` | 0 4px 4px #000000 @ 7.8% | 0 4px 4px #000000 @ 16.1% | — | — |
| `--elevation-stroke` | 0 0 0 1px #000000 @ 7.8% | 0 0 0 1px #000000 @ 16.1% | — | — |
| `--embed-background` | #ffffff | #393a41 | #242429 | #0a0a0c |
| `--embed-background-alternate` | #ffffff | #393a41 | #242429 | #0a0a0c |
| `--experimental-avatar-embed-bg` | #000000 @ 52.2% | #000000 @ 52.2% | #000000 @ 52.2% | #000000 @ 52.2% |
| `--expressive-gradient-blue-end` | #a0a9fa @ 80% | #161a8a @ 45% | #161a8a @ 30% | #161a8a @ 25% |
| `--expressive-gradient-blue-start` | #e6e8ff @ 80% | #5865f2 @ 45% | #5865f2 @ 30% | #5865f2 @ 25% |
| `--expressive-gradient-green-end` | #8af7b5 @ 80% | #006638 @ 45% | #006638 @ 30% | #006638 @ 25% |
| `--expressive-gradient-green-start` | #e5fff0 @ 80% | #21bb63 @ 45% | #21bb63 @ 30% | #21bb63 @ 25% |
| `--expressive-gradient-nitro-green-end` | #5865f2 @ 90% | #1414cb @ 50% | #1414cb @ 40% | #1414cb @ 30% |
| `--expressive-gradient-nitro-green-start` | #e5fff0 @ 90% | #21bb63 @ 50% | #21bb63 @ 40% | #21bb63 @ 30% |
| `--expressive-gradient-nitro-pink-end` | #5865f2 @ 90% | #1414cb @ 50% | #1414cb @ 40% | #1414cb @ 30% |
| `--expressive-gradient-nitro-pink-start` | #fd99e9 @ 90% | #8c1381 @ 50% | #8c1381 @ 40% | #8c1381 @ 30% |
| `--expressive-gradient-pink-end` | #fd99e9 @ 80% | #660066 @ 45% | #660066 @ 30% | #660066 @ 25% |
| `--expressive-gradient-pink-start` | #fbe6ff @ 80% | #b3269c @ 45% | #b3269c @ 30% | #b3269c @ 25% |
| `--expressive-gradient-purple-end` | #ca9ef9 @ 80% | #3e1689 @ 45% | #3e1689 @ 30% | #3e1689 @ 25% |
| `--expressive-gradient-purple-start` | #f3e6ff @ 80% | #a056f2 @ 45% | #a056f2 @ 30% | #a056f2 @ 25% |
| `--expressive-gradient-tenure-badge-bronze-end` | #d93d09 @ 30% | #d93d09 @ 30% | #d93d09 @ 30% | #d93d09 @ 30% |
| `--expressive-gradient-tenure-badge-bronze-start` | #fe9242 @ 30% | #fe9242 @ 30% | #fe9242 @ 30% | #fe9242 @ 30% |
| `--expressive-gradient-tenure-badge-diamond-end` | #612caf @ 30% | #612caf @ 30% | #612caf @ 30% | #612caf @ 30% |
| `--expressive-gradient-tenure-badge-diamond-start` | #a056f2 @ 30% | #a056f2 @ 30% | #a056f2 @ 30% | #a056f2 @ 30% |
| `--expressive-gradient-tenure-badge-emerald-end` | #108e4d @ 30% | #108e4d @ 30% | #108e4d @ 30% | #108e4d @ 30% |
| `--expressive-gradient-tenure-badge-emerald-start` | #35ed7e @ 30% | #35ed7e @ 30% | #35ed7e @ 30% | #35ed7e @ 30% |
| `--expressive-gradient-tenure-badge-gold-end` | #fcb014 @ 30% | #fcb014 @ 30% | #fcb014 @ 30% | #fcb014 @ 30% |
| `--expressive-gradient-tenure-badge-gold-start` | #f3ba2f @ 30% | #f3ba2f @ 30% | #f3ba2f @ 30% | #f3ba2f @ 30% |
| `--expressive-gradient-tenure-badge-opal-end` | #0074e3 @ 30% | #0074e3 @ 30% | #0074e3 @ 30% | #0074e3 @ 30% |
| `--expressive-gradient-tenure-badge-opal-start` | #4cb5bf @ 30% | #4cb5bf @ 30% | #4cb5bf @ 30% | #4cb5bf @ 30% |
| `--expressive-gradient-tenure-badge-platinum-end` | #006b75 @ 30% | #006b75 @ 30% | #006b75 @ 30% | #006b75 @ 30% |
| `--expressive-gradient-tenure-badge-platinum-start` | #79cdd6 @ 30% | #79cdd6 @ 30% | #79cdd6 @ 30% | #79cdd6 @ 30% |
| `--expressive-gradient-tenure-badge-ruby-end` | #620615 @ 30% | #620615 @ 30% | #620615 @ 30% | #620615 @ 30% |
| `--expressive-gradient-tenure-badge-ruby-start` | #de464a @ 30% | #de464a @ 30% | #de464a @ 30% | #de464a @ 30% |
| `--expressive-gradient-tenure-badge-silver-end` | #43434c @ 30% | #43434c @ 30% | #43434c @ 30% | #43434c @ 30% |
| `--expressive-gradient-tenure-badge-silver-start` | #d4d5d8 @ 30% | #d4d5d8 @ 30% | #d4d5d8 @ 30% | #d4d5d8 @ 30% |
| `--gradient-progress-pill-background` | #bebec3 | #5c5d67 | #46474f | #36373e |
| `--guild-header-text-shadow` | 0 1px 1px #ffffff @ 40% | 0 1px 1px #000000 @ 40% | — | — |
| `--guild-profile-banner-background-default` | #70717a | #2c2d32 | #121214 | #000000 |
| `--hexagon-campaign-promo-gradient-1` | #5060c3 @ 60% | #5060c3 @ 60% | #5060c3 @ 60% | #5060c3 @ 60% |
| `--hexagon-campaign-promo-gradient-2` | #9a56c3 @ 60% | #9a56c3 @ 60% | #9a56c3 @ 60% | #9a56c3 @ 60% |
| `--hexagon-campaign-promo-gradient-3` | #e3809c @ 60% | #e3809c @ 60% | #e3809c @ 60% | #e3809c @ 60% |
| `--hexagon-campaign-promo-gradient-4` | #e8a252 @ 60% | #e8a252 @ 60% | #e8a252 @ 60% | #e8a252 @ 60% |
| `--hexagon-campaign-promo-gradient-shade` | #000000 @ 52% | #000000 @ 52% | #000000 @ 52% | #000000 @ 52% |
| `--home-background` | #fbfbfb | #292a2f | #27272c | #27272c |
| `--icon-brand` | #525fe0 | #94a8ff | #798df9 | #6374f4 |
| `--icon-default` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--icon-feedback-critical` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--icon-feedback-info` | #0361bc | #8ebefa | #66a5f3 | #4591ec |
| `--icon-feedback-notification` | #d22d39 | #d22d39 | #d22d39 | #d22d39 |
| `--icon-feedback-positive` | #01713a | #7ecb94 | #5eb479 | #41a063 |
| `--icon-feedback-warning` | #945300 | #fcb529 | #ea9800 | #ce8100 |
| `--icon-invert` | #ffffff | #2f3035 | #2f3035 | #2f3035 |
| `--icon-link` | #006dd4 | #76aff6 | #4d96ee | #2781e7 |
| `--icon-muted` | #6c6d76 | #abacb2 | #96979e | #81828a |
| `--icon-overlay-dark` | #000000 | #000000 | #000000 | #000000 |
| `--icon-overlay-light` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--icon-status-dnd` | #d22d39 | #dc4247 | #dc4247 | #dc4247 |
| `--icon-status-idle` | #faaa00 | #ffcb6e | #ffcb6e | #ffcb6e |
| `--icon-status-offline` | #5f606a | #9d9ea5 | #9d9ea5 | #9d9ea5 |
| `--icon-status-online` | #01783e | #3d9e60 | #3d9e60 | #3d9e60 |
| `--icon-strong` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--icon-subtle` | #595a63 | #c5c6ca | #abacb2 | #96979e |
| `--icon-transparent` | #000000 @ 0% | #000000 @ 0% | #000000 @ 0% | #000000 @ 0% |
| `--icon-voice-connected` | #01783e | #73c48b | #53ad71 | #3d9e60 |
| `--icon-voice-disconnected` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--icon-voice-muted` | #d22d39 | #da3e44 | #da3e44 | #da3e44 |
| `--icon-voice-speaking` | #269153 | #3d9e60 | #3d9e60 | #3d9e60 |
| `--inlinenotice-border-critical` | #d22d39 @ 60% | #d22d39 @ 52.2% | #d22d39 @ 52.2% | #d22d39 @ 60% |
| `--inlinenotice-border-info` | #0074e3 @ 60% | #0074e3 @ 52.2% | #0074e3 @ 52.2% | #0074e3 @ 60% |
| `--inlinenotice-border-positive` | #008545 @ 60% | #008545 @ 52.2% | #008545 @ 52.2% | #008545 @ 60% |
| `--inlinenotice-border-warning` | #f8a300 @ 36.1% | #f8a300 @ 32.2% | #f8a300 @ 32.2% | #f8a300 @ 72.2% |
| `--input-background-default` | #000000 @ 2% | #000000 @ 7.8% | #000000 @ 12.2% | #000000 @ 12.2% |
| `--input-background-error-default` | #d22d39 @ 3.9% | #d22d39 @ 3.9% | #d22d39 @ 3.9% | #d22d39 @ 3.9% |
| `--input-border-active` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--input-border-default` | #97979f @ 40% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--input-border-error-default` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--input-border-hover` | #97979f @ 40% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--input-border-readonly` | #000000 @ 3.9% | #ffffff @ 7.8% | #ffffff @ 7.8% | #ffffff @ 12.2% |
| `--input-icon-default` | #595a63 | #c5c6ca | #abacb2 | #96979e |
| `--input-placeholder-text-default` | #696a73 | #a4a5ab | #8f9097 | #7d7e87 |
| `--input-text-default` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--input-text-error-default` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--interactive-accent-background-active` | #3a48a3 | #3a48a3 | #3a48a3 | #3a48a3 |
| `--interactive-accent-background-default` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--interactive-accent-background-hover` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--interactive-accent-background-selected` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--interactive-background-active` | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 20% |
| `--interactive-background-default` | #97979f @ 7.8% | #97979f @ 7.8% | #97979f @ 7.8% | #97979f @ 7.8% |
| `--interactive-background-hover` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--interactive-background-selected` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--interactive-icon-active` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--interactive-icon-default` | #595a63 | #c5c6ca | #abacb2 | #96979e |
| `--interactive-icon-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--interactive-muted` | #c9cace | #4f505a | #4f505a | #4f505a |
| `--interactive-text-active` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--interactive-text-default` | #595a63 | #c5c6ca | #abacb2 | #96979e |
| `--interactive-text-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--keyword-highlight-background` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--legacy-elevation-border` | 0 0 0 1px #c9cace @ 30% | 0 0 0 1px #1e1f22 @ 60% | 0 0 0 1px #c9cace @ 30% | 0 0 0 1px #c9cace @ 30% |
| `--legacy-elevation-high` | 0 2px 10px 0 #000000 @ 7.8% | 0 2px 10px 0 #000000 @ 20% | 0 2px 10px 0 #000000 @ 7.8% | 0 2px 10px 0 #000000 @ 7.8% |
| `--legacy-elevation-low` | 0 1px 5px #000000 @ 20% | 0 1px 5px 0 #000000 @ 27.8% | 0 1px 5px #000000 @ 20% | 0 1px 5px #000000 @ 20% |
| `--logo-primary` | #5865f2 | #ffffff | #ffffff | #ffffff |
| `--mention-background` | #5865f2 @ 23.9% | #5865f2 @ 23.9% | #5865f2 @ 23.9% | #5865f2 @ 23.9% |
| `--mention-foreground` | #2e3c88 | #cdd7ff | #a9bbff | #8ca0fd |
| `--message-automod-background-default` | #da3e44 @ 5% | #da3e44 @ 5% | #f67774 @ 8% | #f67774 @ 8% |
| `--message-automod-background-hover` | #da3e44 @ 10% | #da3e44 @ 10% | #da3e44 @ 10% | #da3e44 @ 10% |
| `--message-background-hover` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--message-highlight-background-default` | #5865f2 @ 16.1% | #5865f2 @ 16.1% | #5865f2 @ 16.1% | #5865f2 @ 16.1% |
| `--message-highlight-background-hover` | #5865f2 @ 20% | #5865f2 @ 12.2% | #5865f2 @ 12.2% | #5865f2 @ 12.2% |
| `--message-mentioned-background-default` | #f8a300 @ 7.8% | #f8a300 @ 7.8% | #f8a300 @ 7.8% | #f8a300 @ 7.8% |
| `--message-mentioned-background-hover` | #f8a300 @ 12.2% | #f8a300 @ 3.9% | #f8a300 @ 3.9% | #f8a300 @ 3.9% |
| `--mobile-background-scrim-opaque` | #000000 | #000000 | #000000 | #222327 |
| `--mobile-expression-picker-background-default` | #ffffff | #393a41 | #242429 | #0a0a0c |
| `--mobile-guildbar-icon-default` | #595a63 | #c5c6ca | #abacb2 | #96979e |
| `--mobile-searchbar-gradient-background` | #fbfbfb | #323339 | #1a1a1e | #000000 |
| `--mobile-text-heading-primary` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--modal-background` | #ffffff | #393a41 | #242429 | #0a0a0c |
| `--modal-footer-background` | #ffffff | #393a41 | #242429 | #0a0a0c |
| `--navigator-header-tint` | #4f505a | #ffffff | #ffffff | #ffffff |
| `--nitro-tab-gradient-center` | #fd99e9 | #ff4cd2 | #ff4cd2 | #ff4cd2 |
| `--nitro-tab-gradient-inner-ring` | #a0a9fa @ 25% | #5865f2 @ 50% | #5865f2 @ 50% | #5865f2 @ 50% |
| `--nitro-tab-gradient-outer-ring` | #ffffff @ 0% | #5865f2 @ 0% | #5865f2 @ 0% | #5865f2 @ 0% |
| `--notice-background-critical` | #ffdedd | #730e1b | #4f000f | #230004 |
| `--notice-background-info` | #e5efff | #003873 | #00234f | #000a24 |
| `--notice-background-positive` | #c8ffd8 | #00431e | #002b0e | #001002 |
| `--notice-background-warning` | #ffe7cf | #622a00 | #431000 | #240000 |
| `--notice-text-critical` | #690917 | #ffdedd | #ffc0bd | #ffa09b |
| `--notice-text-info` | #003873 | #e5efff | #b0d2ff | #8abcfa |
| `--notice-text-positive` | #00461f | #c1fcd1 | #99e0ad | #7ecb94 |
| `--notice-text-warning` | #5e2700 | #ffe7cf | #ffc356 | #faaa00 |
| `--overlay-backdrop-lightbox` | #000000 @ 92.2% | #000000 @ 92.2% | #000000 @ 92.2% | #000000 @ 92.2% |
| `--panel-bg` | #fbfbfb | #323339 | #1a1a1e | #000000 |
| `--polls-normal-image-background` | #ffffff | #242429 | #242429 | #242429 |
| `--polls-victor-fill` | #269153 @ 20% | #3d9e60 @ 20% | #3d9e60 @ 20% | #3d9e60 @ 20% |
| `--polls-voted-fill` | #5865f2 @ 20% | #5865f2 @ 20% | #5865f2 @ 20% | #5865f2 @ 20% |
| `--premium-nitro-pink-text` | #c639a2 | #ff7dde | #fa4acd | #da41b3 |
| `--profile-gradient-note-background` | #ffffff @ 30% | #000000 @ 30% | #000000 @ 30% | #000000 @ 30% |
| `--profile-gradient-overlay` | #ffffff @ 60% | #000000 @ 60% | #000000 @ 60% | #000000 @ 60% |
| `--profile-gradient-overlay-synced-with-user-theme` | #ffffff @ 80% | #000000 @ 80% | #000000 @ 80% | #000000 @ 80% |
| `--profile-gradient-role-pill-background` | #ffffff @ 50% | #242429 @ 50% | #242429 @ 50% | #242429 @ 50% |
| `--profile-gradient-role-pill-border` | #242429 @ 20% | #ffffff @ 20% | #ffffff @ 20% | #ffffff @ 20% |
| `--profile-gradient-section-box` | #ffffff @ 45% | #000000 @ 45% | #000000 @ 45% | #000000 @ 45% |
| `--progressbar-indicator-background` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--progressbar-track-background` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--quest-home-tab-gradient-blurple-center` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--quest-home-tab-gradient-blurple-inner` | #5865f2 @ 50% | #5865f2 @ 50% | #5865f2 @ 50% | #5865f2 @ 50% |
| `--quest-home-tab-gradient-blurple-outer` | #5865f2 @ 0% | #5865f2 @ 0% | #5865f2 @ 0% | #5865f2 @ 0% |
| `--quest-home-tab-gradient-bright-blue-center` | #408eec | #408eec | #408eec | #408eec |
| `--quest-home-tab-gradient-bright-blue-inner` | #004f9a @ 50% | #004f9a @ 50% | #004f9a @ 50% | #004f9a @ 50% |
| `--quest-home-tab-gradient-bright-blue-outer` | #002b5d @ 0% | #002b5d @ 0% | #002b5d @ 0% | #002b5d @ 0% |
| `--quest-home-tab-gradient-burnt-orange-center` | #fe6e0d | #fe6e0d | #fe6e0d | #fe6e0d |
| `--quest-home-tab-gradient-burnt-orange-inner` | #d93d09 @ 50% | #d93d09 @ 50% | #d93d09 @ 50% | #d93d09 @ 50% |
| `--quest-home-tab-gradient-burnt-orange-outer` | #f25e0c @ 0% | #f25e0c @ 0% | #f25e0c @ 0% | #f25e0c @ 0% |
| `--quest-home-tab-gradient-copper-center` | #e89361 | #e89361 | #e89361 | #e89361 |
| `--quest-home-tab-gradient-copper-inner` | #c96121 @ 50% | #c96121 @ 50% | #c96121 @ 50% | #c96121 @ 50% |
| `--quest-home-tab-gradient-copper-outer` | #7d2d00 @ 0% | #7d2d00 @ 0% | #7d2d00 @ 0% | #7d2d00 @ 0% |
| `--quest-home-tab-gradient-crimson-center` | #dc4247 | #dc4247 | #dc4247 | #dc4247 |
| `--quest-home-tab-gradient-crimson-inner` | #971d28 @ 50% | #971d28 @ 50% | #971d28 @ 50% | #971d28 @ 50% |
| `--quest-home-tab-gradient-crimson-outer` | #4f000f @ 0% | #4f000f @ 0% | #4f000f @ 0% | #4f000f @ 0% |
| `--quest-home-tab-gradient-forest-green-center` | #005f30 | #005f30 | #005f30 | #005f30 |
| `--quest-home-tab-gradient-forest-green-inner` | #003d19 @ 50% | #003d19 @ 50% | #003d19 @ 50% | #003d19 @ 50% |
| `--quest-home-tab-gradient-forest-green-outer` | #001d06 @ 0% | #001d06 @ 0% | #001d06 @ 0% | #001d06 @ 0% |
| `--quest-home-tab-gradient-golden-center` | #ea9800 | #ea9800 | #ea9800 | #ea9800 |
| `--quest-home-tab-gradient-golden-inner` | #a15d00 @ 50% | #a15d00 @ 50% | #a15d00 @ 50% | #a15d00 @ 50% |
| `--quest-home-tab-gradient-golden-outer` | #733700 @ 0% | #733700 @ 0% | #733700 @ 0% | #733700 @ 0% |
| `--quest-home-tab-gradient-indigo-center` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--quest-home-tab-gradient-indigo-inner` | #161a8a @ 50% | #161a8a @ 50% | #161a8a @ 50% | #161a8a @ 50% |
| `--quest-home-tab-gradient-indigo-outer` | #000066 @ 0% | #000066 @ 0% | #000066 @ 0% | #000066 @ 0% |
| `--quest-home-tab-gradient-lemon-drop-center` | #e79418 | #e79418 | #e79418 | #e79418 |
| `--quest-home-tab-gradient-lemon-drop-inner` | #ffe047 @ 50% | #ffe047 @ 50% | #ffe047 @ 50% | #ffe047 @ 50% |
| `--quest-home-tab-gradient-lemon-drop-outer` | #ffed96 @ 0% | #ffed96 @ 0% | #ffed96 @ 0% | #ffed96 @ 0% |
| `--quest-home-tab-gradient-magenta-center` | #ff4cd2 | #ff4cd2 | #ff4cd2 | #ff4cd2 |
| `--quest-home-tab-gradient-magenta-inner` | #b3269c @ 50% | #b3269c @ 50% | #b3269c @ 50% | #b3269c @ 50% |
| `--quest-home-tab-gradient-magenta-outer` | #660066 @ 0% | #660066 @ 0% | #660066 @ 0% | #660066 @ 0% |
| `--quest-home-tab-gradient-mint-center` | #21bb63 | #21bb63 | #21bb63 | #21bb63 |
| `--quest-home-tab-gradient-mint-inner` | #108e4d @ 50% | #108e4d @ 50% | #108e4d @ 50% | #108e4d @ 50% |
| `--quest-home-tab-gradient-mint-outer` | #006638 @ 0% | #006638 @ 0% | #006638 @ 0% | #006638 @ 0% |
| `--quest-home-tab-gradient-silver-center` | #7a7b83 | #7a7b83 | #7a7b83 | #7a7b83 |
| `--quest-home-tab-gradient-silver-inner` | #323339 @ 50% | #323339 @ 50% | #323339 @ 50% | #323339 @ 50% |
| `--quest-home-tab-gradient-silver-outer` | #050506 @ 0% | #050506 @ 0% | #050506 @ 0% | #050506 @ 0% |
| `--quest-home-tab-gradient-teal-center` | #28a7b1 | #28a7b1 | #28a7b1 | #28a7b1 |
| `--quest-home-tab-gradient-teal-inner` | #007f8a @ 50% | #007f8a @ 50% | #007f8a @ 50% | #007f8a @ 50% |
| `--quest-home-tab-gradient-teal-outer` | #006670 @ 0% | #006670 @ 0% | #006670 @ 0% | #006670 @ 0% |
| `--quest-home-tab-gradient-violet-center` | #a056f2 | #a056f2 | #a056f2 | #a056f2 |
| `--quest-home-tab-gradient-violet-inner` | #612caf @ 50% | #612caf @ 50% | #612caf @ 50% | #612caf @ 50% |
| `--quest-home-tab-gradient-violet-outer` | #1d0066 @ 0% | #1d0066 @ 0% | #1d0066 @ 0% | #1d0066 @ 0% |
| `--radio-background-active` | #3a48a3 | #3a48a3 | #3a48a3 | #3a48a3 |
| `--radio-background-default` | #97979f @ 3.9% | #000000 @ 7.8% | #000000 @ 7.8% | #000000 @ 7.8% |
| `--radio-background-hover` | #97979f @ 3.9% | #000000 @ 7.8% | #000000 @ 7.8% | #000000 @ 7.8% |
| `--radio-background-selected-default` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--radio-background-selected-hover` | #4452bb | #4452bb | #4452bb | #4452bb |
| `--radio-border-active` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--radio-border-default` | #84858d | #97979f @ 63.9% | #97979f @ 63.9% | #97979f @ 63.9% |
| `--radio-border-hover` | #5c5d67 | #97979f @ 80% | #97979f @ 80% | #97979f @ 80% |
| `--radio-border-selected-default` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--radio-border-selected-hover` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--radio-foreground-active` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--radio-foreground-default` | #97979f @ 3.9% | #000000 @ 7.8% | #000000 @ 7.8% | #000000 @ 7.8% |
| `--radio-foreground-hover` | #97979f @ 3.9% | #000000 @ 7.8% | #000000 @ 7.8% | #000000 @ 7.8% |
| `--radio-thumb-background-active` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--reaction-background-active` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--reaction-background-default` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--reaction-background-hover` | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 16.1% | #97979f @ 20% |
| `--reaction-background-reacted-default` | #5865f2 @ 23.9% | #5865f2 @ 23.9% | #5865f2 @ 23.9% | #5865f2 @ 23.9% |
| `--reaction-background-reacted-hover` | #5865f2 @ 23.9% | #5865f2 @ 23.9% | #5865f2 @ 23.9% | #5865f2 @ 23.9% |
| `--reaction-border-active` | #97979f @ 52.2% | #97979f @ 43.9% | #97979f @ 43.9% | #97979f @ 43.9% |
| `--reaction-border-default` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--reaction-border-hover` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |
| `--reaction-border-reacted-default` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--reaction-text-active` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--reaction-text-default` | #595a63 | #c5c6ca | #abacb2 | #96979e |
| `--reaction-text-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--reaction-text-reacted-default` | #273478 | #dfe4ff | #b9c8ff | #9aadff |
| `--redesign-button-premium-primary-pink-for-gradient` | #ab5d8a | #ab5d8a | #ab5d8a | #ab5d8a |
| `--redesign-button-premium-primary-pressed-background` | #000000 @ 10% | #000000 @ 10% | #000000 @ 10% | #000000 @ 10% |
| `--redesign-button-premium-primary-purple-for-gradient` | #8547c6 | #8547c6 | #8547c6 | #8547c6 |
| `--redesign-button-premium-primary-purple-for-gradient-2` | #b845c1 | #b845c1 | #b845c1 | #b845c1 |
| `--redesign-button-tertiary-background` | #97979f @ 0% | #97979f @ 0% | #97979f @ 0% | #97979f @ 0% |
| `--redesign-button-tertiary-pressed-background` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--redesign-button-tertiary-pressed-text` | #4f505a | #babbc0 | #d4d5d8 | #c9cace |
| `--redesign-button-tertiary-text` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--scrollbar-auto-scrollbar-color-thumb` | #888991 | #73747d | #5f606a | #595a63 |
| `--scrollbar-auto-scrollbar-color-track` | #efeff1 | #2b2b31 | #0e0e10 | #000000 |
| `--scrollbar-auto-thumb` | #8f9097 | #7d7e87 | #666770 | #595a63 |
| `--scrollbar-auto-track` | #000000 @ 0% | #000000 @ 0% | #000000 @ 0% | #000000 @ 0% |
| `--scrollbar-thin-thumb` | #8b8c94 | #767780 | #5f606a | #595a63 |
| `--scrollbar-thin-track` | #000000 @ 0% | #000000 @ 0% | #000000 @ 0% | #000000 @ 0% |
| `--shadow-border` | 0 0 0 1px #000000 @ 8% | 0 0 0 1px #ffffff @ 8% | 0 0 0 1px #ffffff @ 8% | 0 0 0 1px #ffffff @ 8% |
| `--shadow-border-filter` | drop-shadow(0 0 1px #000000 @ 8%) | drop-shadow(0 0 1px #ffffff @ 8%) | drop-shadow(0 0 1px #ffffff @ 8%) | drop-shadow(0 0 1px #ffffff @ 8%) |
| `--shadow-button-overlay` | 0 12px 24px 0 #000000 @ 24% | 0 12px 24px 0 #000000 @ 24% | 0 12px 24px 0 #000000 @ 24% | 0 12px 24px 0 #000000 @ 24% |
| `--shadow-button-overlay-filter` | drop-shadow(0 12px 24px #000000 @ 24%) | drop-shadow(0 12px 24px #000000 @ 24%) | drop-shadow(0 12px 24px #000000 @ 24%) | drop-shadow(0 12px 24px #000000 @ 24%) |
| `--shadow-high` | 0 12px 36px 0 #000000 @ 12% | 0 12px 24px 0 #000000 @ 24% | 0 12px 24px 0 #000000 @ 24% | 0 12px 24px 0 #000000 @ 24% |
| `--shadow-high-filter` | drop-shadow(0 12px 36px #000000 @ 12%) | drop-shadow(0 12px 24px #000000 @ 24%) | drop-shadow(0 12px 24px #000000 @ 24%) | drop-shadow(0 12px 24px #000000 @ 24%) |
| `--shadow-ledge` | 0 2px 0 0 #000000 @ 3%,0 1.5px 0 0 #000000 @ 3%,0 1px 0 0 #000000 @ 8% | 0 2px 0 0 #000000 @ 5%,0 1.5px 0 0 #000000 @ 5%,0 1px 0 0 #000000 @ 16% | 0 2px 0 0 #000000 @ 5%,0 1.5px 0 0 #000000 @ 5%,0 1px 0 0 #000000 @ 16% | 0 2px 0 0 #000000 @ 5%,0 1.5px 0 0 #000000 @ 5%,0 1px 0 0 #000000 @ 16% |
| `--shadow-ledge-filter` | drop-shadow(0 1.5px 0 #000000 @ 12%) | drop-shadow(0 1.5px 0 #000000 @ 24%) | drop-shadow(0 1.5px 0 #000000 @ 24%) | drop-shadow(0 1.5px 0 #000000 @ 24%) |
| `--shadow-low` | 0 1px 4px 0 #000000 @ 8% | 0 1px 4px 0 #000000 @ 14% | 0 1px 4px 0 #000000 @ 14% | 0 1px 4px 0 #000000 @ 14% |
| `--shadow-low-active` | 0 0 4px 0 #000000 @ 8% | 0 0 4px 0 #000000 @ 14% | 0 0 4px 0 #000000 @ 14% | 0 0 4px 0 #000000 @ 14% |
| `--shadow-low-active-filter` | drop-shadow(0 0 4px #000000 @ 8%) | drop-shadow(0 0 4px #000000 @ 14%) | drop-shadow(0 0 4px #000000 @ 14%) | drop-shadow(0 0 4px #000000 @ 14%) |
| `--shadow-low-filter` | drop-shadow(0 1px 4px #000000 @ 8%) | drop-shadow(0 1px 4px #000000 @ 14%) | drop-shadow(0 1px 4px #000000 @ 14%) | drop-shadow(0 1px 4px #000000 @ 14%) |
| `--shadow-low-hover` | 0 4px 8px 0 #000000 @ 8% | 0 4px 10px 0 #000000 @ 14% | 0 4px 10px 0 #000000 @ 14% | 0 4px 10px 0 #000000 @ 14% |
| `--shadow-low-hover-filter` | drop-shadow(0 4px 8px #000000 @ 8%) | drop-shadow(0 4px 10px #000000 @ 14%) | drop-shadow(0 4px 10px #000000 @ 14%) | drop-shadow(0 4px 10px #000000 @ 14%) |
| `--shadow-medium` | 0 4px 8px 0 #000000 @ 8% | 0 4px 8px 0 #000000 @ 16% | 0 4px 8px 0 #000000 @ 16% | 0 4px 8px 0 #000000 @ 16% |
| `--shadow-medium-filter` | drop-shadow(0 4px 8px #000000 @ 8%) | drop-shadow(0 4px 8px #000000 @ 16%) | drop-shadow(0 4px 8px #000000 @ 16%) | drop-shadow(0 4px 8px #000000 @ 16%) |
| `--shadow-mobile-chatinput` | 0 -1px 4px 0 #1a1a1e @ 50% | 0 -1px 4px 0 #1a1a1e @ 50% | 0 -1px 4px 0 #1a1a1e @ 50% | 0 -1px 4px 0 #1a1a1e @ 50% |
| `--shadow-mobile-chatinput-filter` | drop-shadow(0 -1px 4px #1a1a1e @ 50%) | drop-shadow(0 -1px 4px #1a1a1e @ 50%) | drop-shadow(0 -1px 4px #1a1a1e @ 50%) | drop-shadow(0 -1px 4px #1a1a1e @ 50%) |
| `--shadow-mobile-navigator-x` | 0 0 9px 0 #000000 @ 13% | 0 0 10px 0 #000000 @ 22% | 0 0 10px 0 #000000 @ 22% | 0 0 10px 0 #000000 @ 22% |
| `--shadow-mobile-navigator-x-filter` | drop-shadow(0 0 9px #000000 @ 13%) | drop-shadow(0 0 10px #000000 @ 22%) | drop-shadow(0 0 10px #000000 @ 22%) | drop-shadow(0 0 10px #000000 @ 22%) |
| `--shadow-top-high` | 0 -12px 36px 0 #000000 @ 12% | 0 -12px 32px 0 #000000 @ 24% | 0 -12px 32px 0 #000000 @ 24% | 0 -12px 32px 0 #000000 @ 24% |
| `--shadow-top-high-filter` | drop-shadow(0 -12px 36px #000000 @ 12%) | drop-shadow(0 -12px 32px #000000 @ 24%) | drop-shadow(0 -12px 32px #000000 @ 24%) | drop-shadow(0 -12px 32px #000000 @ 24%) |
| `--shadow-top-ledge` | 0 -2px 0 0 #000000 @ 3%,0 -1.5px 0 0 #000000 @ 3%,0 -1px 0 0 #000000 @ 8% | 0 -2px 0 0 #000000 @ 5%,0 -1.5px 0 0 #000000 @ 5%,0 -1px 0 0 #000000 @ 16% | 0 -2px 0 0 #000000 @ 5%,0 -1.5px 0 0 #000000 @ 5%,0 -1px 0 0 #000000 @ 16% | 0 -2px 0 0 #000000 @ 5%,0 -1.5px 0 0 #000000 @ 5%,0 -1px 0 0 #000000 @ 16% |
| `--shadow-top-ledge-filter` | drop-shadow(0 -1.5px 0 #000000 @ 12%) | drop-shadow(0 -1.5px 0 #000000 @ 24%) | drop-shadow(0 -1.5px 0 #000000 @ 24%) | drop-shadow(0 -1.5px 0 #000000 @ 24%) |
| `--shadow-top-low` | 0 -1px 4px 0 #000000 @ 8% | 0 -1px 4px 0 #000000 @ 14% | 0 -1px 4px 0 #000000 @ 14% | 0 -1px 4px 0 #000000 @ 14% |
| `--shadow-top-low-filter` | drop-shadow(0 -1px 4px #000000 @ 8%) | drop-shadow(0 -1px 4px #000000 @ 14%) | drop-shadow(0 -1px 4px #000000 @ 14%) | drop-shadow(0 -1px 4px #000000 @ 14%) |
| `--slider-track-background` | #c5c6ca | #595a63 | #474851 | #383940 |
| `--spine-default` | #c5c6ca | #595a63 | #474851 | #383940 |
| `--spoiler-hidden-background` | #8f9097 | #7d7e87 | #666770 | #595a63 |
| `--spoiler-hidden-background-hover` | #70717a | #9d9ea5 | #84858d | #767780 |
| `--spoiler-revealed-background` | #ebeced | #242429 | #6c6d76 @ 16% | #6c6d76 @ 16% |
| `--standard-tab-gradient-center` | #a0a9fa | #5865f2 | #5865f2 | #5865f2 |
| `--standard-tab-gradient-inner-ring` | #c3c8fc @ 25% | #5865f2 @ 50% | #5865f2 @ 50% | #5865f2 @ 50% |
| `--standard-tab-gradient-outer-ring` | #c3c8fc @ 0% | #5865f2 @ 0% | #5865f2 @ 0% | #5865f2 @ 0% |
| `--status-danger` | #d6363f | #da3e44 | #da3e44 | #da3e44 |
| `--status-online` | #269153 | #3d9e60 | #3d9e60 | #3d9e60 |
| `--status-positive` | #269153 | #3d9e60 | #3d9e60 | #3d9e60 |
| `--status-positive-background` | #008043 | #008043 | #008043 | #008043 |
| `--status-positive-text` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--status-speaking` | #3d9e60 | #3d9e60 | #3d9e60 | #3d9e60 |
| `--status-warning` | #bb7300 | #fdb833 | #fdb833 | #fdb833 |
| `--status-warning-background` | #bb7300 | #fdb833 | #fdb833 | #fdb833 |
| `--status-warning-text` | #ffffff | #000000 | #000000 | #000000 |
| `--steam-review-text-mixed` | #884800 | #ffc252 | #f49f00 | #d78900 |
| `--steam-review-text-negative` | #d22d39 | #fd8c87 | #f06a67 | #e24d50 |
| `--steam-review-text-positive` | #006dd4 | #7ab2f7 | #4d96ee | #2781e7 |
| `--switch-background-active` | #3a48a3 | #3a48a3 | #3a48a3 | #3a48a3 |
| `--switch-background-default` | #000000 @ 2% | #000000 @ 12.2% | #000000 @ 12.2% | #000000 @ 12.2% |
| `--switch-background-hover` | #000000 @ 2% | #000000 @ 12.2% | #000000 @ 12.2% | #000000 @ 12.2% |
| `--switch-background-selected-default` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--switch-background-selected-hover` | #4452bb | #4452bb | #4452bb | #4452bb |
| `--switch-border-default` | #000000 @ 16.1% | #97979f @ 20% | #97979f @ 20% | #97979f @ 20% |
| `--switch-border-hover` | #000000 @ 43.9% | #97979f @ 40% | #97979f @ 40% | #97979f @ 40% |
| `--switch-border-selected-default` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--switch-border-selected-hover` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--switch-thumb-background-default` | #62636d | #ffffff | #ffffff | #ffffff |
| `--switch-thumb-background-selected-default` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--switch-thumb-icon-active` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--switch-thumb-icon-default` | #ffffff | #2f3035 | #2f3035 | #2f3035 |
| `--tabs-indicator-default` | #525fe0 | #94a8ff | #798df9 | #6374f4 |
| `--tabs-indicator-overlay` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--text-brand` | #525fe0 | #94a8ff | #798df9 | #6374f4 |
| `--text-code` | #36373e | #ffffff | #e4e4e6 | #c9cace |
| `--text-code-addition` | #005f30 | #99e0ad | #7ac991 | #5bb277 |
| `--text-code-attribute` | #0158ab | #abcfff | #82b7f8 | #5ea0f1 |
| `--text-code-builtin` | #884800 | #ffc252 | #f49f00 | #dc8d00 |
| `--text-code-bullet` | #0158ab | #abcfff | #82b7f8 | #5ea0f1 |
| `--text-code-comment` | #696a73 | #b3b3b9 | #999aa1 | #888991 |
| `--text-code-decorator` | #884800 | #ffc252 | #f49f00 | #dc8d00 |
| `--text-code-deletion` | #9e1f2a | #ffbdb9 | #ff9691 | #f67774 |
| `--text-code-error` | #a9232e | #ffbdb9 | #ff9691 | #f67774 |
| `--text-code-escape` | #9b277e | #ffb6ed | #ff8be2 | #ff59d5 |
| `--text-code-keyword` | #a9232e | #ffbdb9 | #ff9691 | #f67774 |
| `--text-code-link` | #0158ab | #abcfff | #82b7f8 | #5ea0f1 |
| `--text-code-namespace` | #0158ab | #abcfff | #82b7f8 | #5ea0f1 |
| `--text-code-number` | #963b03 | #fcc0a1 | #efa275 | #e18752 |
| `--text-code-operator` | #971d28 | #ffcfcd | #ffaba6 | #fc8884 |
| `--text-code-property` | #00636e | #8edae1 | #63c1ca | #36abb6 |
| `--text-code-regexp` | #006734 | #96dda9 | #73c48b | #57af74 |
| `--text-code-section` | #a9232e | #ffbdb9 | #ff9691 | #f67774 |
| `--text-code-string` | #006734 | #96dda9 | #73c48b | #57af74 |
| `--text-code-tag` | #9b277e | #ffb6ed | #ff8be2 | #ff59d5 |
| `--text-code-title` | #404eb1 | #bccaff | #9db0ff | #8195fb |
| `--text-code-type` | #9b277e | #ffb6ed | #ff8be2 | #ff59d5 |
| `--text-code-variable` | #36373e | #ffffff | #e4e4e6 | #c9cace |
| `--text-default` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--text-feedback-critical` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--text-feedback-info` | #0361bc | #8ebefa | #66a5f3 | #4591ec |
| `--text-feedback-positive` | #01713a | #7ecb94 | #5eb479 | #41a063 |
| `--text-feedback-warning` | #945300 | #fcb529 | #ea9800 | #ce8100 |
| `--text-invert` | #ffffff | #2f3035 | #2f3035 | #2f3035 |
| `--text-link` | #006dd4 | #76aff6 | #4d96ee | #2781e7 |
| `--text-muted` | #6c6d76 | #abacb2 | #96979e | #81828a |
| `--text-overlay-dark` | #000000 | #000000 | #000000 | #000000 |
| `--text-overlay-light` | #ffffff | #ffffff | #ffffff | #ffffff |
| `--text-status-dnd` | #d22d39 | #dc4247 | #dc4247 | #dc4247 |
| `--text-status-idle` | #faaa00 | #ffcb6e | #ffcb6e | #ffcb6e |
| `--text-status-offline` | #5f606a | #9d9ea5 | #9d9ea5 | #9d9ea5 |
| `--text-status-online` | #01783e | #3d9e60 | #3d9e60 | #3d9e60 |
| `--text-strong` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--text-subtle` | #595a63 | #c5c6ca | #abacb2 | #96979e |
| `--text-voice-connected` | #01783e | #73c48b | #53ad71 | #3d9e60 |
| `--text-voice-disconnected` | #b92733 | #ffa09b | #f87e7a | #eb5f5e |
| `--text-voice-speaking` | #269153 | #3d9e60 | #3d9e60 | #3d9e60 |
| `--textbox-markdown-syntax` | #41424a | #999aa1 | #96979e | #96979e |
| `--thread-channel-spine` | #c9cace | #4f505a | #4f505a | #4f505a |
| `--toast-critical-background` | #d22d39 @ 12.2% | #d22d39 @ 20% | #d22d39 @ 12.2% | #d22d39 @ 12.2% |
| `--toast-critical-border` | #e24d50 | #e24d50 | #e24d50 | #e24d50 |
| `--toast-success-background` | #008545 @ 12.2% | #008545 @ 20% | #008545 @ 12.2% | #008545 @ 12.2% |
| `--toast-success-border` | #34995b | #34995b | #34995b | #34995b |
| `--togglebutton-background-selected` | #5865f2 @ 16.1% | #5865f2 @ 16.1% | #5865f2 @ 16.1% | #5865f2 @ 16.1% |
| `--togglebutton-background-selected-active` | #97979f @ 23.9% | #97979f @ 20% | #97979f @ 20% | #97979f @ 23.9% |
| `--togglebutton-background-selected-hover` | #5865f2 @ 23.9% | #5865f2 @ 23.9% | #5865f2 @ 23.9% | #5865f2 @ 23.9% |
| `--togglebutton-border-active` | #5865f2 @ 83.9% | #5865f2 @ 83.9% | #5865f2 @ 83.9% | #5865f2 @ 83.9% |
| `--togglebutton-border-selected` | #5865f2 | #5865f2 | #5865f2 | #5865f2 |
| `--togglebutton-critical-background-selected` | #d22d39 @ 12.2% | #d22d39 @ 12.2% | #d22d39 @ 12.2% | #d22d39 @ 12.2% |
| `--togglebutton-critical-background-selected-hover` | #d22d39 @ 16.1% | #d22d39 @ 16.1% | #d22d39 @ 16.1% | #d22d39 @ 16.1% |
| `--togglebutton-critical-border-active` | #d22d39 @ 32.2% | #d22d39 @ 32.2% | #d22d39 @ 32.2% | #d22d39 @ 32.2% |
| `--togglebutton-critical-icon-active` | #d22d39 | #da3e44 | #da3e44 | #da3e44 |
| `--togglebutton-critical-icon-default` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--togglebutton-critical-icon-hover` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--togglebutton-critical-icon-selected` | #d22d39 | #da3e44 | #da3e44 | #da3e44 |
| `--togglebutton-critical-icon-selected-hover` | #d22d39 | #da3e44 | #da3e44 | #da3e44 |
| `--togglebutton-icon-active` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--togglebutton-icon-default` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--togglebutton-icon-hover` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--togglebutton-icon-only-icon-active` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--togglebutton-icon-only-icon-default` | #2e2e34 | #f3f3f4 | #efeff1 | #d4d5d8 |
| `--togglebutton-icon-only-icon-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--togglebutton-icon-only-icon-selected` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--togglebutton-icon-only-icon-selected-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--togglebutton-icon-selected` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--togglebutton-icon-selected-hover` | #28282d | #ffffff | #fbfbfb | #dcdcdf |
| `--user-profile-activity-toolbar-background` | #ffffff | #3f4048 | #2c2d32 | #17181b |
| `--user-profile-background-hover` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--user-profile-border` | #97979f @ 27.8% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 20% |
| `--user-profile-note-background-focus` | #f3f3f4 | #2c2d32 | #121214 | #000000 |
| `--user-profile-overlay-background` | #ffffff | #3f4048 | #2c2d32 | #17181b |
| `--user-profile-overlay-background-hover` | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% | #97979f @ 12.2% |
| `--user-profile-toolbar-background` | #ffffff | #3f4048 | #2c2d32 | #17181b |
| `--user-profile-toolbar-border` | #97979f @ 20% | #97979f @ 3.9% | #97979f @ 3.9% | #97979f @ 16.1% |

### Theme-independent design tokens

Defined on `:root` / `.visual-refresh` and the same in every theme (density can change the `--space-xs/sm/md` aliases, see section 3). Primitive palettes and z-index/profile internals are omitted.

| Property | Value |
|---|---|
| `--application-subscription-end` | #0177a4 |
| `--application-subscription-start` | #3442d9 |
| `--breakpoint-1024` | 1024px |
| `--breakpoint-1280` | 1280px |
| `--breakpoint-1536` | 1536px |
| `--breakpoint-1800` | 1800px |
| `--breakpoint-2500` | 2500px |
| `--breakpoint-480` | 480px |
| `--breakpoint-640` | 640px |
| `--breakpoint-768` | 768px |
| `--breakpoint-lg` | 1280px |
| `--breakpoint-max` | 2500px |
| `--breakpoint-md` | 1024px |
| `--breakpoint-sm` | 768px |
| `--breakpoint-xl` | 1536px |
| `--breakpoint-xs` | 640px |
| `--breakpoint-xxl` | 1800px |
| `--breakpoint-xxs` | 480px |
| `--button-border-radius` | 2147483647px |
| `--button-border-radius-lg` | 2147483647px |
| `--channels-name-line-height` | 24px |
| `--channels-spine-inverted-offset-top` | 6px |
| `--channels-spine-offset-left` | 24px |
| `--chat-avatar-size` | 40px |
| `--chat-input-icon-size` | 20px |
| `--chat-markup-line-height` | 1.375rem |
| `--chat-resize-handle-width` | 8px |
| `--collapse-easing-function` | ease-in |
| `--collapse-fade-duration` | 150ms |
| `--collapse-structural-duration` | 150ms |
| `--control-input-height-md` | 40px |
| `--control-input-height-sm` | 32px |
| `--control-item-height-md` | 40px |
| `--control-item-height-sm` | 32px |
| `--custom-app-sidebar-target-width` | 340px |
| `--custom-app-top-bar-height` | 32px |
| `--custom-app-top-bar-item-radius` | 6px |
| `--custom-application-directory-content-max-width` | 1024px |
| `--custom-application-directory-content-min-width` | 600px |
| `--custom-application-directory-profile-icon-size` | 122px |
| `--custom-application-directory-profile-sidebar-margin-right` | 48px |
| `--custom-application-directory-profile-sidebar-width` | 192px |
| `--custom-application-directory-search-sidebar-margin-right` | 32px |
| `--custom-application-directory-search-sidebar-width` | 200px |
| `--custom-application-store-home-store-home-width` | 1245px |
| `--custom-application-store-listing-body-max-width` | 880px |
| `--custom-button-button-lg-height` | 44px |
| `--custom-button-button-lg-width` | 130px |
| `--custom-button-button-md-height` | 38px |
| `--custom-button-button-md-width` | 96px |
| `--custom-button-button-sm-height` | 32px |
| `--custom-button-button-sm-width` | 60px |
| `--custom-button-button-tn-height` | 24px |
| `--custom-button-button-tn-width` | 52px |
| `--custom-button-button-xl-height` | 50px |
| `--custom-button-button-xl-width` | 148px |
| `--custom-button-filled-active` | 0.2 |
| `--custom-button-filled-hover` | 0.1 |
| `--custom-button-link-underline-offset` | 1px |
| `--custom-button-link-underline-stop` | 2px |
| `--custom-button-link-underline-width` | 1px |
| `--custom-button-transition-duration` | 170ms |
| `--custom-channel-attachment-upload-mini-attachment-size` | 78px |
| `--custom-channel-attachment-upload-spoiler-blur-radius` | 44px |
| `--custom-channel-call-participants-popout-padding-value` | 16px |
| `--custom-channel-header-height` | 49px |
| `--custom-channel-members-bg` | #1a1a1e |
| `--custom-channel-text-area-button-hover-scale` | 0.85714 |
| `--custom-channel-textarea-text-area-height` | 56px |
| `--custom-channel-textarea-text-area-max-height` | 50vh |
| `--custom-chat-aligned-icon-offset` | ((40px - 20px)/2) |
| `--custom-emoji-picker-border-radius` | 8px |
| `--custom-emoji-picker-constants-category-separator-margin-vertical` | 12px |
| `--custom-emoji-picker-constants-category-separator-size` | 1px |
| `--custom-emoji-picker-constants-diversity-emoji-container-padding-horizontal` | 7px |
| `--custom-emoji-picker-constants-diversity-emoji-container-padding-vertical` | 7px |
| `--custom-emoji-picker-constants-diversity-emoji-size` | 24px |
| `--custom-emoji-picker-constants-emoji-container-padding-horizontal` | 4px |
| `--custom-emoji-picker-constants-emoji-container-padding-vertical` | 4px |
| `--custom-emoji-picker-constants-emoji-list-padding-bottom` | 8px |
| `--custom-emoji-picker-constants-emoji-list-padding-left` | 8px |
| `--custom-emoji-picker-constants-emoji-list-padding-right` | 0 |
| `--custom-emoji-picker-constants-emoji-list-padding-top` | 0 |
| `--custom-emoji-picker-constants-emoji-list-search-results-padding-top` | 8px |
| `--custom-emoji-picker-constants-emoji-picker-height` | 440px |
| `--custom-emoji-picker-constants-emoji-premium-upsell-height` | 54px |
| `--custom-emoji-picker-constants-emoji-premium-upsell-margin-top` | 16px |
| `--custom-emoji-picker-constants-emoji-section-margin-bottom` | 12px |
| `--custom-emoji-picker-constants-emoji-size-large` | 48px |
| `--custom-emoji-picker-constants-emoji-size-medium` | 40px |
| `--custom-emoji-picker-constants-guild-category-icon-margin-verical` | 8px |
| `--custom-emoji-picker-constants-guild-category-icon-size` | 32px |
| `--custom-emoji-picker-constants-min-emoji-picker-width` | 498px |
| `--custom-emoji-picker-constants-newly-added-emoji-badge-height` | 16px |
| `--custom-emoji-picker-constants-unicode-category-icon-margin-vertical` | 2px |
| `--custom-emoji-picker-constants-unicode-category-icon-padding` | 4px |
| `--custom-emoji-picker-constants-unicode-category-icon-size` | 24px |
| `--custom-emoji-picker-constants-unicode-category-shortcut-height` | 48px |
| `--custom-emoji-size-emoji` | 1.375em |
| `--custom-emoji-size-jumbo-emoji` | 3rem |
| `--custom-guild-boosting-marketing-progress-bar-end-markers-margin` | 4px |
| `--custom-guild-boosting-marketing-progress-bar-marker-dimensions` | 32px |
| `--custom-guild-boosting-marketing-progress-bar-marker-marker-dimensions` | 32px |
| `--custom-guild-boosting-marketing-tier-cards-tier-card-border-radius` | 16px |
| `--custom-guild-boosting-sidebar-display-conditional-bottom-margin` | 12px |
| `--custom-guild-count-large-icon-size` | 20px |
| `--custom-guild-count-small-icon-size` | 16px |
| `--custom-guild-dialog-icon-padding` | 4px |
| `--custom-guild-dialog-icon-size` | 84px |
| `--custom-guild-dialog-popout-width` | 250px |
| `--custom-guild-dialog-splash-ratio` | 1.77778 |
| `--custom-guild-directory-entry-card-card-height` | 274px |
| `--custom-guild-directory-gutter-size` | 16px |
| `--custom-guild-directory-landing-min-header-height` | 200px |
| `--custom-guild-directory-max-page-width` | 1608px |
| `--custom-guild-directory-min-card-width` | 248px |
| `--custom-guild-directory-min-content-width` | 320px |
| `--custom-guild-discovery-card-card-height` | 320px |
| `--custom-guild-discovery-card-card-height-with-tags` | 350px |
| `--custom-guild-discovery-gutter-size` | 16px |
| `--custom-guild-discovery-max-page-width` | 1608px |
| `--custom-guild-list-padding` | 16px |
| `--custom-guild-list-width` | 72px |
| `--custom-guild-member-application-review-sidebar-width` | 29vw |
| `--custom-guild-onboarding-home-page-max-page-width` | 1128px |
| `--custom-guild-onboarding-home-page-max-single-column-width` | 704px |
| `--custom-guild-product-download-modal-header-image-width` | 119px |
| `--custom-guild-role-subscription-card-basic-info-tier-image-size` | 80px |
| `--custom-guild-role-subscription-card-basic-info-tier-image-size-mobile` | 48px |
| `--custom-guild-role-subscription-style-constants-cover-image-aspect-ratio` | 4 |
| `--custom-guild-role-subscriptions-overview-page-page-max-width` | 1180px |
| `--custom-guild-settings-community-intro-content-spacing` | 32px |
| `--custom-guild-settings-community-intro-hover-distance` | -12px |
| `--custom-guild-settings-community-intro-text-spacing` | 8px |
| `--custom-guild-settings-discovery-landing-page-max-width-tab` | 905px |
| `--custom-guild-settings-discovery-landing-page-settings-max-width` | 520px |
| `--custom-guild-settings-partner-content-spacing` | 32px |
| `--custom-guild-settings-premium-tier-status-progress-with-subscriptions-margin-top` | 7px |
| `--custom-guild-settings-role-subscriptions-max-width` | 905px |
| `--custom-guild-settings-role-subscriptions-overview-settings-max-width` | 520px |
| `--custom-guild-settings-roles-edit-shared-sidebar-width` | 232px |
| `--custom-guild-settings-store-page-settings-max-width` | 520px |
| `--custom-guild-shop-channel-row-border-gradient` | linear-gradient(113deg,#6591ff,#d150ff) |
| `--custom-guild-shop-channel-row-glow` | 0 0 4px #bd95ff @ 50% |
| `--custom-guild-shop-channel-row-gradient` | linear-gradient(113deg,#2f3570 1.98%,#422c70 94.48%) |
| `--custom-guild-shop-channel-row-gradient-hover` | linear-gradient(113deg,#383f86 1.98%,#4d3385 94.48%) |
| `--custom-guild-shop-content-width` | 1044px |
| `--custom-guild-shop-content-width-minimum` | 688px |
| `--custom-guild-shop-content-width-reduced` | 788px |
| `--custom-guild-shop-gradient-end` | #c356fd |
| `--custom-guild-shop-gradient-start` | #686bff |
| `--custom-guild-shop-page-two-column-max-width` | 1439px |
| `--custom-guild-shop-preview-pill-shadow-dark` | -4px 5px #1d1d1d |
| `--custom-guild-shop-preview-pill-shadow-light` | -4px 5px #d7dce8 |
| `--custom-guild-sidebar-width` | 268px |
| `--custom-guild-sticker-upload-modal-emoji-margin` | 10px |
| `--custom-guild-sticker-upload-modal-emoji-size` | 22px |
| `--custom-guild-stickers-tiers-grid-breakpoint` | 1010px |
| `--custom-guild-tooltip-icon-size` | 20px |
| `--custom-guild-tooltip-icon-size-v-2` | 16px |
| `--custom-header-icon-color-expired` | #4e5058 |
| `--custom-member-list-item-avatar-decoration-padding` | 2px |
| `--custom-member-list-width` | 264px |
| `--custom-message-attachment-spoiler-blur-radius` | 44px |
| `--custom-message-avatar-decoration-size` | 48px |
| `--custom-message-avatar-size` | 40px |
| `--custom-message-helpers-popout-container-width` | 288px |
| `--custom-message-helpers-popout-content-width` | 256px |
| `--custom-message-helpers-popout-padding-width` | 16px |
| `--custom-message-margin-compact-indent` | 5rem |
| `--custom-message-margin-horizontal` | 16px |
| `--custom-message-margin-left-content-cozy` | 72px |
| `--custom-message-meta-space` | 0.25rem |
| `--custom-message-padding-vertical-container-compact` | 0.125rem |
| `--custom-message-reply-indent` | 0.625rem |
| `--custom-message-reply-message-preview-line-height` | 1.125rem |
| `--custom-message-spacing-vertical-container-cozy` | 0.125rem |
| `--custom-messages-popout-messages-popout-footer-height` | 120px |
| `--custom-modal-min-width-large` | 800px |
| `--custom-scrollbar-border-radius` | 7px |
| `--custom-scrollbar-scrollbar-margin` | 3px |
| `--custom-scrollbar-scrollbar-width` | 14px |
| `--custom-user-profile-popout-body-padding-inline` | 16px |
| `--custom-user-profile-popout-width` | 300px |
| `--decoration-to-avatar-ratio` | 1.2 |
| `--expand-easing-function` | ease-out |
| `--expand-fade-duration` | 200ms |
| `--expand-structural-duration` | 100ms |
| `--font-clan-body` | Fraunces,"gg sans",serif,"Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif |
| `--font-clan-signature` | Corinthia,"gg sans",cursive,"Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif |
| `--font-code` | "gg mono","Source Code Pro",Consolas,"Andale Mono WT","Andale Mono","Lucida Console","Lucida Sans Typewriter","DejaVu Sans Mono","Bitstream Vera Sans Mono","Liberation Mono","Nimbus Mono L",Monaco,"Courier New",Courier,monospace |
| `--font-display-marketing` | "ABC Ginto Discord","gg sans",serif,"Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif |
| `--font-display-marketing-header` | "ABC Ginto Discord Nord","gg sans",serif,"Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif |
| `--font-headline` | "ABC Ginto Nord","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif |
| `--font-nitro` | "ABC Ginto Discord Nord","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif |
| `--font-primary` | "gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif |
| `--font-weight-black` | 900 |
| `--font-weight-bold` | 700 |
| `--font-weight-extra-bold` | 800 |
| `--font-weight-extrabold` | 800 |
| `--font-weight-light` | 300 |
| `--font-weight-medium` | 500 |
| `--font-weight-normal` | 400 |
| `--font-weight-semibold` | 600 |
| `--form-input-height` | 44px |
| `--guild-boosting-blue` | #3e70dd |
| `--guild-boosting-blue-for-gradients` | #3442d9 |
| `--guild-boosting-pink` | #ff73fa |
| `--guild-boosting-pink-refresh` | #ff4cd2 |
| `--guild-boosting-purple` | #b377f3 |
| `--guild-boosting-purple-for-gradients` | #9b44f7 |
| `--guildbar-avatar-size` | 40px |
| `--guildbar-folder-size` | 48px |
| `--icon-size-lg` | 32px |
| `--icon-size-md` | 24px |
| `--icon-size-sm` | 18px |
| `--icon-size-xs` | 16px |
| `--icon-size-xxs` | 12px |
| `--menu-border-width` | 1px |
| `--menu-scroller-block-padding` | 8px |
| `--modal-horizontal-padding` | 24px |
| `--modal-vertical-padding` | 16px |
| `--modal-width-large` | 800px |
| `--modal-width-medium` | 602px |
| `--modal-width-small` | 442px |
| `--motion-spring-subtle` | linear(0,0.00508 1%,0.02111 2.1%,0.04883 3.3%,0.08833 4.6%,0.13142 5.8%,0.18324 7.1%,0.48034 13.9%,0.55807 15.8%,0.62269 17.5%,0.6919 19.5%,0.75326 21.5%,0.80671 23.5%,0.85247 25.5%,0.89618 27.8%,0.93123 30.1%,0.96072 32.6%,0.9833 35.2%,1.0001 38%,1.01135 41%,1.01793 44.4%,1.02007 48.4%,1.00268 74.6%,1) |
| `--motion-spring-subtle-duration` | 598ms |
| `--radius-lg` | 16px |
| `--radius-md` | 12px |
| `--radius-none` | 0px |
| `--radius-round` | 2147483647px |
| `--radius-sm` | 8px |
| `--radius-xl` | 24px |
| `--radius-xs` | 4px |
| `--radius-xxl` | 32px |
| `--select-max-width` | 248px |
| `--select-option-height` | 40px |
| `--size-0` | 0px |
| `--size-12` | 12px |
| `--size-128` | 128px |
| `--size-16` | 16px |
| `--size-160` | 160px |
| `--size-192` | 192px |
| `--size-20` | 20px |
| `--size-24` | 24px |
| `--size-32` | 32px |
| `--size-4` | 4px |
| `--size-48` | 48px |
| `--size-64` | 64px |
| `--size-8` | 8px |
| `--size-80` | 80px |
| `--size-96` | 96px |
| `--size-lg` | 20px |
| `--size-md` | 16px |
| `--size-sm` | 12px |
| `--size-xl` | 24px |
| `--size-xs` | 8px |
| `--size-xxl` | 32px |
| `--size-xxs` | 4px |
| `--space-0` | 0px |
| `--space-10` | 10px |
| `--space-12` | 12px |
| `--space-128` | 128px |
| `--space-16` | 16px |
| `--space-160` | 160px |
| `--space-192` | 192px |
| `--space-20` | 20px |
| `--space-24` | 24px |
| `--space-26` | 26px |
| `--space-30` | 30px |
| `--space-32` | 32px |
| `--space-4` | 4px |
| `--space-40` | 40px |
| `--space-48` | 48px |
| `--space-6` | 6px |
| `--space-64` | 64px |
| `--space-8` | 8px |
| `--space-80` | 80px |
| `--space-96` | 96px |
| `--space-lg` | 20px |
| `--space-md` | 16px |
| `--space-sm` | 12px |
| `--space-xl` | 24px |
| `--space-xs` | 8px |
| `--space-xxl` | 32px |
| `--space-xxs` | 4px |
| `--toast-animation-duration-ms` | 300px |
| `--toast-max-width` | 280px |
| `--toast-queue-enter-delay-ms` | 400px |
| `--toast-text-line-count` | 2px |

## 2. Nitro client themes (gradient / "custom" themes)

### Where the presets come from

The stylesheets only consume theme values; the presets themselves are defined in the client JavaScript (main bundle `web.b2b84438f3c83e84.js`, downloaded 2026-10-29 to `.discord-reference/js`). Each preset carries an id, a base theme, a list of colour stops (a colour token plus a stop position in percent), an angle, a "midpoint percentage" and, for one preset, an overlay-opacity multiplier. Display names are localised strings; the English string chunk returned 404 from the CDN, so the names below are the ids in title case (they match the names shown in the client as far as known, but were not read from the strings file).

When a preset is applied, the client writes a style block for the root element (class `custom-theme-background`, plus `custom-client-theme`) containing:

| Property | Value for a preset |
|---|---|
| `--custom-theme-background` | `linear-gradient(<angle>deg, …stops)` — the string is built by the caller in a lazily loaded chunk; colour + position per stop is the natural reading of the preset data (inferred) |
| `--custom-theme-primary-color` / `--custom-theme-secondary-color` | first stop colour / last stop colour |
| `--custom-background-gradient-opacity-multiplier` | the preset's overlay multiplier clamped to 0–1 (1 unless stated) |
| `--custom-theme-base-color-amount` | **50%** |
| `--custom-theme-text-color-amount` | **38%** |
| `--custom-theme-base-color-dark` / `-light` (+ `-hsl`) | derived tint, see rule below |
| `--custom-theme-text-color-dark` / `-light` | derived tint, see rule below |

Tint derivation (from first and last stop): take the lighter (by relative luminance) as L and the darker as D (if D has no hue, use L).
- Dark base: base tint = D's hue at 100% saturation, 5% lightness; text tint = L's hue at 100% saturation, 80% lightness if the hue is between 200° and 300°, otherwise 95%.
- Light base: base tint = L's hue at 100% saturation, 90% lightness; text tint = D's hue at 100% saturation, 25% lightness if the hue is 200–300°, otherwise 15%.

Both variants are always written; the root's theme class picks one (dark-based presets are offered for Ash, Dark and Onyx; light-based for Light).

### Preset table

Hex tints below were computed with that rule (rounded to 8-bit). "Base" is the theme the preset belongs to.

| Preset (id → name) | Base | Angle | Stops (color @ position) | Tint used on dark base: base / text | Tint used on light base: base / text | Midpoint % | Veil multiplier |
|---|---|---|---|---|---|---|---|
| `MINT_APPLE` → Mint Apple | light | 180° | #56b69f @ 6.15%, #63bc61 @ 48.7%, #9eca67 @ 93.07% | #001a13 / #f4ffe5 | #e8ffcc / #004d3a | 27 | 1 |
| `CITRUS_SHERBERT` → Citrus Sherbert | light | 180° | #f3b336 @ 31.1%, #ee8558 @ 67.09% | #1a0800 / #fff6e5 | #ffeecc / #4d1700 | 27 | 1 |
| `RETRO_RAINCLOUD` → Retro Raincloud | light | 148.71° | #3a7ca1 @ 5.64%, #7f7eb9 @ 26.38%, #7f7eb9 @ 49.92%, #3a7ca1 @ 73.12% | #00101a / #99daff | #ccedff / #005280 | 50 | 1 |
| `HANAMI` → Hanami | light | 38.08° | #efaab3 @ 3.56%, #efd696 @ 35.49%, #a6daa2 @ 68.78% | #1a0003 / #e7ffe5 | #d0ffcc / #4d000a | 50 | 1 |
| `SUNRISE` → Sunrise | light | 154.19° | #9f4175 @ 8.62%, #c49064 @ 48.07%, #a6953d @ 76.04% | #1a000e / #fffbe5 | #fff7cc / #4d002a | 50 | 1 |
| `COTTON_CANDY` → Cotton Candy | light | 180.14° | #f4abb8 @ 8.5%, #b1c2fc @ 94.28% | #1a0005 / #99b0ff | #ccd8ff / #4d000e | 50 | 1 |
| `LOFI_VIBES` → Lofi Vibes | light | 179.52° | #a4c0f7 @ 7.08%, #a9e4e8 @ 34.94%, #b0e2b8 @ 65.12%, #cfdfa2 @ 96.23% | #00091a / #f8ffe5 | #f2ffcc / #002b80 | 27 | 1 |
| `DESERT_KHAKI` → Desert Khaki | light | 38.99° | #e7dbd0 @ 12.92%, #dfd0b2 @ 32.92%, #e0d6a3 @ 52.11% | #1a1500 / #fff2e5 | #ffe4cc / #4d4000 | 50 | 1 |
| `SUNSET` → Sunset | dark | 141.68° | #48288c @ 27.57%, #db7f4b @ 71.25% | #08001a / #ffefe5 | #ffdecc / #290080 | 35 | 1 |
| `CHROMA_GLOW` → Chroma Glow | dark | 128.92° | #0eb5bf @ 3.94%, #4c0ce0 @ 26.1%, #a308a7 @ 39.82%, #9a53ff @ 56.89%, #218be0 @ 76.45% | #000e1a / #e5feff | #ccfcff / #004780 | 15 | 1 |
| `FOREST` → Forest | dark | 162.27° | #142215 @ 11.2%, #2d4d39 @ 29.93%, #454c32 @ 48.64%, #5a7c58 @ 67.85%, #a98e4b @ 83.54% | #001a02 / #fff8e5 | #fff0cc / #004d05 | 50 | 1 |
| `CRIMSON_MOON` → Crimson Moon | dark | 64.92° | #950909 @ 16.17%, #000000 @ 72% | #1a0000 / #ffe5e5 | #ffcccc / #4d0000 | 30 | 1 |
| `MIDNIGHT_BLURPLE` → Midnight Blurple | dark | 48.17° | #5348ca @ 11.21%, #140730 @ 61.92% | #08001a / #a299ff | #d0ccff / #280080 | 24 | 1 |
| `MARS` → Mars | dark | 170.82° | #895240 @ 14.61%, #8f4343 @ 74.62% | #1a0600 / #ffece5 | #ffd9cc / #4d1300 | 50 | 1 |
| `DUSK` → Dusk | dark | 180° | #665069 @ 12.84%, #91a3d1 @ 85.99% | #16001a / #99b6ff | #ccdaff / #700080 | 50 | 1 |
| `UNDER_THE_SEA` → Under The Sea | dark | 179.14° | #647962 @ 1.91%, #588575 @ 48.99%, #6a8482 @ 96.35% | #021a00 / #e5fffd | #ccfffb / #074d00 | 50 | 1 |
| `RETRO_STORM` → Retro Storm | dark | 148.71° | #3a7ca1 @ 5.64%, #58579a @ 26.38%, #58579a @ 49.92%, #3a7ca1 @ 73.12% | #00101a / #99daff | #ccedff / #005280 | 61 | 1 |
| `NEON_NIGHTS` → Neon Nights | dark | 180° | #01a89e @ 0%, #7d60ba @ 50%, #b43898 @ 100% | #1a0014 / #e5fffd | #ccfffc / #4d003b | 50 | 1 |
| `STRAWBERRY_LEMONADE` → Strawberry Lemonade | dark | 161.03° | #af1a6c @ 18.79%, #c26b20 @ 49.76%, #e7a525 @ 80.72% | #1a000e / #fff6e5 | #ffeecc / #4d002a | 32 | 1 |
| `AURORA` → Aurora | dark | 239.16° | #062053 @ 10.39%, #191fbb @ 26.87%, #13929a @ 48.31%, #218573 @ 64.98%, #051a81 @ 92.5% | #00091a / #99aaff | #ccd5ff / #002b80 | 34 | 1 |
| `SEPIA` → Sepia | dark | 69.98° | #857664 @ 14.14%, #5b4421 @ 60.35% | #1a0f00 / #fff3e5 | #ffe8cc / #4d2e00 | 50 | 1 |
| `BLURPLE_TWILIGHT` → Blurple Twilight | dark | 47.61° | #2c3fe7 @ 11.18%, #261d83 @ 64.54% | #02001a / #99a3ff | #ccd1ff / #0b0080 | 50 | 1 |
| `EASTER_EGG` → Easter Egg | light | 180° | #7289da @ 4%, #4e5d94 @ 96% | #00051a / #99b0ff | #ccd7ff / #001b80 | 50 | 1 |
| `HEXAGON` → Hexagon | dark | 135° | #4645ff @ 0%, #af01f3 @ 33.33%, #ff6698 @ 66.67%, #f89a03 @ 100% | #00001a / #fff5e5 | #ffebcc / #010080 | 35 | 0.8 |

`EASTER_EGG` is filtered out of the normal picker list (a hidden preset); `HEXAGON` is listed separately from the two main groups. The midpoint percentage is stored with each preset but its consumer is in a lazily loaded chunk that was not available; it is not used by the style block above.

### User-built ("custom") gradients

The theme editor builds the same kind of style block from the user's chosen colours, angle and a 0–100 "mix" slider u (f = 100 − u):

| Property | Value |
|---|---|
| `--custom-theme-background` | `linear-gradient(<angle>deg, <colours>)` (a single colour is repeated) |
| `--custom-background-gradient-opacity-multiplier` | 1 |
| `--custom-background-gradient-chat-opacity-base-light` | 0.95 |
| `--custom-background-gradient-highest-opacity-base-light` | 1.0 |
| `--custom-background-gradient-opacity-mix-amount` | (30 + 0.7·f) / 100 |
| `--custom-theme-border-color-amount` | 5% |
| base / text mix amounts | dark base: (60 + 0.4·f)% / 30%; light base: (30 − 0.2·u)% / 40% |
| dark tints | base = darkest colour at 100% sat, 5% light; text = darkest colour with lightness (100 − 0.1·f)% |
| light tints | base = lightest colour at 100% sat, 90% light; text = lightest colour with lightness 0.05·f% |

### Base theme selection

A gradient theme always rides on one of two bases: the root element carries `.custom-theme-background` (any custom background) and `.custom-client-theme` (a Nitro client theme) together with **`.theme-dark`** or **`.theme-light`**. Dark-based presets use Ash's token set as the starting point; light-based presets use Light's. When `.custom-theme-background` is combined with a theme class, the CSS points the generic tint properties at the matching variant: `--custom-theme-base-color` → `…-base-color-dark` or `…-light`, `--custom-theme-text-color` → `…-text-color-dark` or `…-light`.

### Layer 1: token tinting (color-mix)

When the browser supports `color-mix()` (all current ones), every themed colour token is redefined as an Oklab mix of its normal value at 100% with a tint at a variable percentage:

| Tint | Mix amount property | Token families tinted (count in Dark) |
|---|---|---|
| `--custom-theme-base-color` | `--custom-theme-base-color-amount` | 172 tokens: all `--background-*` surfaces (base-low/lower/lowest, surface-high/higher/highest, accent, code, feedback, scrim), `--bg-surface-raised`, `--chat-background*`, `--input-background-*`, `--interactive-background-*` and `--interactive-accent-background-*`, `--scrollbar-*` thumb/track, ANSI colours. Translucent tokens are mixed against the tint at the same alpha. |
| `--custom-theme-text-color` | `--custom-theme-text-color-amount` | 128 tokens: `--text-*` (incl. all `--text-code-*`), `--icon-*` (incl. status icons), `--interactive-text-*`, `--interactive-icon-*`, `--interactive-muted`, `--channels-default`, `--chat-text-muted`, `--input-text-*`, `--input-placeholder-*`, `--control-brand-foreground*`. |
| `--custom-theme-base-color` (alpha kept) | `--custom-theme-border-color-amount`, falling back to the base amount | 35 tokens: `--border-*` (subtle, normal, strong, muted, focus, feedback), `--chat-border`, `--input-border-*`, `--control-secondary-border-*`, `--app-frame-border`. |

The user's "adaptive theme" preference clamps these: `.reduce-adaptive-theme` forces both base and text amounts to 20%, `.disable-adaptive-theme` forces them to 0% (gradient stays, colours don't tint).

### Layer 2: the gradient image and translucent overlays

`.custom-theme-background` defines `--custom-background-gradient-cover` as the gradient image fixed to the viewport (`fixed 0 0 / cover`). Each surface tier then gets its own `--background-gradient-<tier>` value: a flat translucent colour (a one-colour `linear-gradient`) painted **over** that same fixed gradient. Because every layer uses `background-attachment: fixed`, the gradient appears continuous across panels while each panel has its own veil opacity.

Veil colour: `rgb(0 0 0)` on dark bases, `rgb(255 255 255)` on light bases (`--custom-background-gradient-color`).

Veil opacity per tier (with the default mix amount / multiplier of 1; the client-theme formulas are `base + mix × 0.4 × factor`, so a lower mix amount drops toward the base value):

| Tier token | Dark base, alpha | Dark client-theme formula | Light base, alpha | Light client-theme formula |
|---|---|---|---|---|
| `--background-gradient-lowest` | 0.90 | 0.54 + m·0.36 | 0.85 | 0.51 + m·0.34 |
| `--background-gradient-lower` | 0.85 | 0.51 + m·0.34 | 0.80 | 0.48 + m·0.32 |
| `--background-gradient-low` | 0.80 | 0.48 + m·0.32 | 0.75 | 0.45 + m·0.30 |
| `--background-gradient-chat` | 0.80 | 0.48 + m·0.32 | 0.85 | 0.85 × (0.6 + m·0.4) |
| `--background-gradient-high` | 0.75 | 0.45 + m·0.30 | 0.70 | 0.42 + m·0.28 |
| `--background-gradient-higher` | 0.70 | 0.42 + m·0.28 | 0.65 | 0.325 + m·0.325 |
| `--background-gradient-app-frame` | = higher (0.70) | = higher | = higher (0.65) | = higher |
| `--background-gradient-highest` | 0.65 | 0.39 + m·0.26 | 0.95 | 0.95 × (0.8 + m·0.2) |

(m = `--custom-background-gradient-opacity-mix-amount`. For non-client custom backgrounds each value is instead `clamp(0, multiplier × alpha, 1)`.) `--background-gradient-chat-preview` is the chat veil over the raw gradient without the fixed attachment, for previews.

### Which element gets which tier

| Tier | Elements (readable class prefix) |
|---|---|
| app-frame | app background `bg_`, title bar `titleBar_`, server rail tree `tree_` (custom theme only), window chrome `withBackgroundOverride_` |
| high | channel/guild sidebar `guildSidebar_`, DM list `privateChannels_`, DM search `searchBarComponent_`, a `scroller_` in module 99e7c, generic `container_` (551b0), mobile header (dark) |
| highest | composer `channelTextArea_`, `chatInputSurface_`, user panel `panels_`, floating panel on hover/focus |
| chat | `chat_`, `chatContent_`, member list `members_`/`member_`/`container_` (c8ffbb), forum/now-playing columns, side nav |
| low | search bar `searchBar_` (c322aa), button fill in custom-theme buttons (hover → high), mobile search (dark) / header (light) |
| lower | boost container, topic pills/scroller, reply/thread-suggestion bars and stacked bars on light |
| lowest | reply bar, scheduled-message bar, stacked bars above composer on dark; `listeningAlong_` |
| higher | upload overlay `upload_` |

### Other per-theme adjustments under a custom theme

- Tooltips and context menus gain a `1px solid var(--border-strong)` border and the tooltip pointer is hidden.
- Embeds use `--background-mod-subtle`; file attachments `--background-mod-subtle` with `--border-subtle`; inline code mixes `--background-code` 95% with white.
- The user panel border uses `--app-frame-border`; the sidebar's decorative `:after` and the composer's `:before` fade are removed; several panels (`panel_`, `quickBar_`, edge fades) drop their solid backgrounds so the gradient shows through.
- Profile-style custom backgrounds (not client themes) get an app border: `--custom-app-border-frame-base` = 50/50 Oklab mix of primary and secondary colours, and `--app-border-frame` = that base at 24% mixed into `--border-subtle`.
- Light client theme: the chat title bar uses the chat veil (`--background-gradient-lowest` re-pointed to `--background-gradient-chat`).
- Progress bars switch their indicator to `--background-brand` (or the theme text colour on the track variant).

## 3. Component measurements

Conventions: px values resolved (1rem = 16px); colours named by token (see section 1 for values); module hashes in brackets identify the CSS module (the suffix after the readable class prefix). "Token only" means the colour tokens exist but the rules that use them were not in the saved stylesheets.

### Gaps in the capture

These modules were not among the 300 saved stylesheets (they load lazily), so only their tokens are known:
- Guild text/voice channel rows and category headers (`containerDefault`, `modeSelected`, `modeUnread`, `wrapperCommon`). Channel-row data below comes from the DM/private rows, which share the row layout.
- Message list item (`messageListItem`, `groupStart`, plain hover background, mentioned/selected/replying/highlighted states).
- Reactions, the chat `.mention` pill, typing-indicator dots.

### Density

`.density-compact / default / cozy` on the root change the semantic space tokens:

| Token | Compact | Default | Cozy |
|---|---|---|---|
| `--space-xs` | 6 | 8 | 10 |
| `--space-sm` | 10 | 12 | 16 |
| `--space-md` | 12 | 16 | 20 |

Radii: `--radius-xs` 4, `-sm` 8, `-md` 12, `-lg` 16, `-xl` 24, `-xxl` 32. Other modifier classes seen on components: `.refresh-fast-follow-avatars`, `.refresh-fast-follow-guild-bg`, `.refresh-fast-follow-distinct-borders`, `.refresh-title-bar-small/large`, `.enlarge-target-size`, `.mana-type-consolidation`, `.custom-theme-background`, `.a11y-font-scaled-up/down`, `.font-size-*`.

### App layout and sidebar (5e434)

| Element / state | Property | Value |
|---|---|---|
| sidebar | width | `--custom-guild-sidebar-width` 268px (a subgrid spanning rail + channel column) |
| sidebar | background | `--background-base-lower` declared then unset → transparent; frame shows through |
| sidebar `:after` | strip | 8px at bottom, `--background-base-lowest`, hidden under custom themes |
| channel column | width | 268 − rail − 1 = 195px at default density |
| channel column | border | 1px `--app-frame-border` on start and top edges; rounded variant top-start radius 12px |
| collapsed | width | rail + 4px |
| resize handle | | 4px, transparent → `--background-mod-strong` on hover/active/focus, .2s with .1s delay |
| app grid | rows | title bar (`--custom-app-top-bar-height`), notice, 1fr |
| page (Onyx, high contrast) | border | 1px `--border-subtle` start border |

### Title bar (c38106)

| Element / state | Property | Value |
|---|---|---|
| bar | height | 32px (`.refresh-title-bar-small` 24, `-large` 40) |
| bar | layout | gap 8; padding-end 12 (0 on Windows/Linux); macOS padding-start = rail + 16 = 88px |
| leading / trailing groups | gap | 12 |
| window buttons | | bar-height square (32×32), gap 4, `--interactive-text-default`; hover `--interactive-background-hover`, active `-active` |
| close hover | | `--control-critical-primary-background-default`, icon `--control-critical-primary-icon-default` |
| divider before window buttons | | 1×20px `--border-subtle`, margin-inline 4 |
| item radius | | `--custom-app-top-bar-item-radius` 6px |

### Layers (960e4, 59d0d)

| Element | Value |
|---|---|
| app background `.bg` | `--background-gradient-app-frame`, else `--background-base-lowest` (`--app-frame-background` under refresh-fast-follow-guild-bg) |
| `.layer` | `--background-base-low`; base layer transparent; absolute inset 0, flex column |
| layerContainer | absolute, pointer-events none, z-index 1002; children re-enable pointer events |
| Windows | layer padding-top 22, top −22 |

### Server rail (5e434, ef3116, 6e9f8, 58105, 252b6, cc5dd2, 463b7, 3b95d, 5bc7e, 48112, 1f388)

| Element / state | Property | Value |
|---|---|---|
| rail | width | `--custom-guild-list-width` = avatar + 2×`--space-md`: 72px default (compact 64, cozy 80); with refresh-fast-follow-avatars: compact 64, default/cozy 76 |
| guild icon | size | `--guildbar-avatar-size` 40px (44 with refresh-fast-follow-avatars at default/cozy) |
| folder | size | `--guildbar-folder-size` 48px (52 under refresh-fast-follow) |
| rail wrapper | background | `--background-base-lowest` (`--app-frame-background` with refresh-fast-follow-guild-bg; app-frame veil on custom themes) |
| rail wrapper | bottom fade | 16px mask fade; margin-bottom = panels height + `--space-xs` − 16 |
| scroller | padding | bottom 24 (`--space-xs` + 16); top 4 (desktop), 12 (overlay) |
| list item | layout | rail width, centered; vertical gap not set in CSS (8px inferred from folder first-child margin) |
| guild item | colours | `--text-default` on `--background-mod-subtle` (no-icon); hover/selected `--background-brand` + `--white`; scale variant 1.1 |
| guild item | transition | transform, background-color, color .15s ease-out |
| icon shape | radius | not in CSS: the circle→rounded-square morph is an SVG mask (inferred 50% at rest, ≈16px hovered/selected) |
| press | | translateY(1px) |
| acronym | font | weight 500, line-height 1.2em |
| pill wrapper | | 8px wide, full height |
| pill | base | 8px wide, radius 0 4 4 0, margin-start −4, `--text-strong`, opacity 0, translateX(−4) |
| pill | unread / hover / selected | height 8 / 20 / 40px, opacity 1, translateX(0) |
| pill (small variant) | | round; hover 10 / selected 24 |
| pill | transition | height, opacity, transform .2s ease-out (full motion) |
| separator | | 32×1px, radius 1, `--app-frame-border` |
| lower/upper badge | | absolute bottom-end / top-end; cut-out is SVG; keyboard focus ring 8px stroke `--blue-345` |
| number badge | | centered, `--radius-round`; size and colour set inline |
| "NEW"/"LIVE" pill badge (52929) | | 16px tall, min-width 16, padding 0 6, radius 8, uppercase, white text |
| add server / discover | | avatar-size button, `--background-mod-subtle`, `--text-default`; hover/selected `--background-brand` (+ white); icon 20×20; .15s |
| home logo | | 28×20 |
| folder | | icon radius 12, colour `--custom-folder-color` else `--background-brand`; open background radius 16, 1px `--border-muted`, `--background-mod-subtle`; 2×2 preview gap 2, padding 4 |
| unread-mentions bar (3b95d) | | 24px tall, radius 12, 12px/600/16px uppercase, shadow 0 2px 6px `--opacity-black-24`; unread: `--background-surface-highest`, 1px `--border-normal`, `--text-strong`; mention: `--background-feedback-notification`, `--text-overlay-light`, `--shadow-medium` |

### Channel / DM list rows (972a0 + row layout 91a9d)

| Element / state | Property | Value |
|---|---|---|
| row | margin / max-width | margin-start 8 / 268 |
| row container | | radius 8, padding 1px 0, colour `--channels-default`, no transition |
| inner | padding | inline 8 / 8 (32 end when a nameplate is shown) |
| layout | height | 42px (44 with container padding) |
| avatar | | 32×32, margin-end 12 |
| hover / active / selected | background | `--interactive-background-hover` / `-active` / `-selected` |
| interactive text | colour | `--text-muted`; selected `--text-default` (DM), `--interactive-text-active` (layout rows) |
| link rows (Friends, Nitro, Shop) | | gap 8, padding 8 block, 8 / 16 inline |
| link icon | | 20×20 `--icon-muted`, selected `--icon-strong` |
| unread pill | | 4×8, radius 0 4 4 0, 8px left of the row, `--interactive-text-active` |
| muted | | avatar/icon opacity .3 → 1 on hover |
| close button | | hidden until hover/focus, 16px icon, opacity .7 → 1 (24px box with enlarge-target-size) |
| name | | 16px mask fade at end |

### DM list header and search (e6b769)

| Element | Value |
|---|---|
| list background | `--background-gradient-high`, else `--background-base-lowest` |
| search strip | 49px tall (`--custom-channel-header-height`), padding 0 8, 1px `--border-subtle` bottom |
| search button | full width, `--input-background-default`, 1px `--input-border-default`, radius 8, padding 10 12, 14px/500, `--text-muted`, ellipsis |
| section divider | 1px `--border-subtle`, margin 12 8 |
| "Direct Messages" header | 24px tall, padding-inline 16 / 8, bottom 4; hover `--interactive-text-hover`; add icon 16 |
| scroller | padding bottom 16, end 8 |

### User panel (5e434 panels, 37e49, 67645, 5e764)

| Element / state | Property | Value |
|---|---|---|
| panels | layout | floating, inset 8px from bottom/start, width 100% − 16 |
| panels | look | radius 8, 1px `--border-muted`, `--background-gradient-highest` else `--background-base-low`, z-index 10 |
| container | | height 56 (min 44), padding 12 (compact 10, cozy 14; 8 with refresh-fast-follow-avatars), radius 7, gap 8, 14px/500 |
| account button | | radius 4, gap 8, padding 5 4, margin-start −4, min-width 112; hover `--background-mod-normal` + `--interactive-text-hover`, .2s |
| avatar hover | | opacity .8 |
| name block | | line-height 22, margins −1 / 2 |
| buttons | | gap 8; each 32×32, radius 8, `--icon-subtle`; hover `--control-secondary-background-hover` + `--interactive-text-hover`; disabled .4; bg transition .2s |
| muted / deafened | | `--opacity-red-12` (hover 24%), icon `--icon-feedback-critical` |
| split chevron | | 16×32, 1px gap; hover `--background-mod-muted`; open `--interactive-background-selected` |

### Chat area (f75fb0)

| Element / state | Property | Value |
|---|---|---|
| `.chat` | background | `--background-gradient-chat`, else `--background-base-lowest`; flex column |
| `.chat` with border | | top 1px `--app-frame-border` |
| `.chat` with side panel | | end 1px `--border-subtle`, top-end radius 12 |
| `.chatContent` | background | `--background-gradient-chat`, else `--background-base-lower` |
| content ledge | | `--shadow-ledge`, 1px, hidden by default |
| `.form` | | margin-top −16, padding-inline 8 |
| above composer | fade | 8px gradient transparent → `--background-base-low` |
| composer wrapper | | `--background-gradient-highest`, else `--chat-background-default`; margin-bottom 8 |
| `.typing` | | flex only (indicator rules not captured) |

### Chat header bar (9293f)

| Element / state | Property | Value |
|---|---|---|
| container | | height 49, padding 8 (start 16), 16px / 20px, `--text-default`, bottom 1px `--border-subtle` (`--app-frame-border` with distinct borders) |
| background (themed) | | dark: `--background-gradient-lower`; light: `--background-gradient-lowest`; else `--background-base-lower` |
| title | | nowrap ellipsis, margin-end 8; clickable min-height 24, hover `--text-strong` |
| channel icon | | margin-inline −1 / 9 |
| toolbar | | flex, gap 8, padding-start 8 |
| icon wrapper / icon | | 32×32 / 20×20 |
| icon colours | | non-clickable `--channel-icon`; clickable `--icon-muted`, hover `--icon-subtle`, selected `--icon-strong`; disabled opacity .6 |
| icon badge | | 8×8 (10 tall with text), radius 8, top/right 2; `--background-feedback-notification` or `--background-brand` |
| divider | | 1×24, margin 0 4, `--border-subtle` |
| caret | | 10px, `--icon-muted` |
| right-edge fade | | 8px gradient into bar background |

### Message (c19a55)

| Element / state | Property | Value |
|---|---|---|
| wrapper | | min-height 22, padding-end 16 |
| cozy wrapper | | padding 2px block, start 72 (40 avatar + 16 + 16) |
| compact wrapper | | padding 2px block, start 80 (5rem) |
| avatar (cozy) | | 40×40 round, absolute at start 16, margin-top 2; placeholder `--background-mod-subtle`; z 1 |
| avatar hover / press | | drop-shadow `--elevation-medium` (full motion) / translateY(1) |
| avatar decoration | | 48px centred on avatar |
| compact avatar | | 1em square, inline, top .18em |
| header (cozy) | | `--text-muted`, line-height 22, min-height 22 |
| username | | 16px / 500 / 22, `--text-strong`; clickable hover underline; light theme on 1× displays 600 |
| header text gap | | margin-end 4 |
| role icon | | 20×20, margin-start 4, top 1 |
| timestamp (cozy) | | 12px / 22, `--chat-text-muted`, weight 500, margin-start 4 |
| timestamp (compact, and cozy gutter time) | | 11px / 22, `--text-muted`, align end, margin-end 4; gutter version absolute, 56px wide, shown on hover/focus |
| compact timestamp width | | latin 12h 36px, 24h 49.6px, CJK 68px |
| edited | | 10px / 400 / line-height 1 |
| message content | | colour `--custom-message-content-color` else `--text-default` |
| bot tag | | top 1.6px, margin 4 |
| reply preview | | 14px / 18px, `--text-default`; avatar 16 round; name opacity .64; spine 2px `--spine-default`, top-start radius 6; hover `--text-strong` |
| thread spine | | 2px `--spine-default`, bottom-start radius 8 |
| sending / failed | | opacity .5 / `--text-feedback-critical` |
| compact clan tag | | `--background-mod-strong`, radius 4, padding 0 4; hover `--background-mod-muted` |
| hover toolbar anchor | | absolute top 0, end 0 |
| a11y-font-scaled-down | | avatar 40 at start 16 (rem based), inset 72, gutter time 56 |
| a11y-font-scaled-up | | gutter time 12px |

Token only: mentioned `--message-mentioned-background-default` / `-hover`; highlighted `--message-highlight-background-default` / `-hover`; AutoMod `--message-automod-background-default` / `-hover`.

### Message hover toolbar (f7ecac)

| Element / state | Property | Value |
|---|---|---|
| bar | | 32px tall, `--background-surface-highest`, radius 4, shadow `--shadow-border` + `--shadow-low` (medium on hover), separators 1px `--border-subtle` |
| button | | 24×24 content + 4 padding (32×32), `--interactive-text-default` |
| hover / active / selected | | `--interactive-background-hover` + `--interactive-text-hover` / `-active` with 1px push / `-selected` |
| danger | | `--control-critical-secondary-text-*` |

### Composer (74017)

| Element / state | Property | Value |
|---|---|---|
| text area box | | 1px `--border-muted`, radius 8, width 100%; border-color and box-shadow .2s |
| focus-within | | `--border-subtle` (`--app-frame-border` with distinct borders) |
| highlighted / error | | 0 0 0 4px `--blue-345` / 0 0 0 2px `--text-feedback-critical` |
| custom theme | | `--background-gradient-highest` else `--input-background-default`; border `--app-frame-border` |
| scroll container | | radius 8, max-height 50vh; scrollbar 12 with 4 border, thumb `--primary-800` @ .6, radius 8 |
| inner | | padding-start 15 (12 while recording voice) |
| attach button | | margin-inline −14 / 10 |
| text | | 16px / 400 / 22, `--text-default`; placeholder `--text-muted` |
| height | | 56px (`--custom-channel-textarea-text-area-height`), padding 17 0, end 10 |
| button row | | gap 8, height 56, margin-end 6, sticky top |
| buttons | | min 32×32; icons 20×20; `--interactive-text-default` → hover `--interactive-text-hover` on `--interactive-background-selected`, radius 8, .2s; open `--interactive-text-active` |
| emoji button | | greyscale sprite mask in `--interactive-text-default`, colour sprite on hover |
| stacked bars above input | | `--background-surface-higher`, top radius 8, dividers 1px `--border-subtle` |
| inline edit box | | 44px, `--input-background-default`, `--input-border-default` |
| upload card (aa605f) | | 200×200, padding 8, `--background-surface-high`, 1px `--border-normal`, radius 8, `--shadow-low` |

### Member list (c8ffbb, 5d473, 91a9d)

| Element / state | Property | Value |
|---|---|---|
| container | | `--background-gradient-chat` else `--background-base-lower`; start 1px `--border-subtle` |
| list | width | 264 (compact 256, cozy 268), padding-bottom 10; full width ≤485px |
| group header | padding | 20 top, 4 bottom, 16 start, 4 end (text from shared text component) |
| member | | margin-start 8, max-width list − 16; inner padding 4 block |
| row | | radius 8, layout 42 tall, avatar 32 + 12 gap, inline padding 8 |
| hover / active / selected | | `--interactive-background-hover` + `--interactive-text-hover` / `-active` / `-selected` + `--interactive-text-active` |
| offline | | opacity .3 → 1 on hover |
| owner crown | | 14×14 `--text-feedback-warning` |

### Embed (623de)

| Element | Value |
|---|---|
| card | radius 4, grid, `--background-surface-high`, 1px `--border-subtle`, left 4px `--border-normal` (replaced by the embed colour at runtime, inferred) |
| grid padding | 2 top, 16 bottom, 12 start, 16 end; thumbnail column min-content |
| author | 24 round icon, gap 8, 14px / 600 `--text-strong` |
| title | 16px / 600 `--text-strong` |
| description / field values | `--text-default`, pre-line |
| fields | margin-top 8, gap 8; name margin-bottom 2 |
| thumbnail | margin-start 16, top 8; radius 4 |
| media | radius 4, margin-top 16; gallery gap 4 |
| footer | icon 20 round, gap 8; separator margin 0 4 |
| provider link | `--interactive-text-default` → hover `--interactive-text-hover` |
| custom theme | `--background-mod-subtle` |

### Attachments

| Element | Value |
|---|---|
| file (0ccae) | 432 wide max, padding 16, radius 8, `--background-surface-high`, 1px `--border-subtle`, `--shadow-low`; icon 30×40 gap 8; name 16px / 400 `--interactive-text-active`, link `--text-link` (underline on hover); size `--text-muted` |
| image (af017a) | radius 3, placeholder `--background-base-low`, .2s fade; spinner 24 on `--opacity-black-48` |
| audio / video (cf09d8) | radius 3, `--background-base-lower`; audio 432 wide, padding 16, radius 8, 1px `--border-subtle`; video controls 32 tall `--opacity-black-60`; control icons 24 + 4 padding; time `--font-code` 12px / 500 |
| loading skeleton (fc8177) | avatar 40, text blobs 16 tall radius 8, attachment 240×120 radius 6 |

### Markup, code, quotes (75297, highlight styles)

| Element | Value |
|---|---|
| body | 16px / 22 (`--chat-markup-line-height`), message content colour |
| link | `--text-link`; underline on hover (always with `.decorate-links`) |
| bold | 700 |
| inline code | `--font-code` 85% (≈13.6px) / 18px, padding 0 .2em, radius 4, `--background-code`, 1px `--border-normal` |
| code block `pre` | radius 4, margin-top 6, max-width 90%, `--font-code` |
| code block inner | padding ≈7px (.5em), radius 4, `--background-base-lower`, text `--text-code`, 1px `--border-normal`, 14px / 18px (inferred cascade) |
| syntax | `--text-code-keyword`, `-string`, `-title`, `-comment`, `-number` …; diff `--background-code-addition` / `-deletion` |
| copy actions | top 8, end 4, shown on hover |
| block quote | bar 4px wide, radius 4, `--spine-default`; padding 0 8 0 12; `--text-subtle`; margin 4 0 |
| headings h1 / h2 / h3 | 24 / 20 / 16px, 700, line-height 1.375em, `--text-strong`, margin 16 0 8 |
| subtext | 14px / 19.25, `--text-subtle` |
| lists | margin 4 0 0 16; item gap 4 |
| timestamp token | `--background-mod-normal`, radius 3, padding 0 2 |
| role mention | 500 |

Mentions (token only): `--mention-background` (#5865f2 @ 23.9%), `--mention-foreground` (light #2e3c88, Ash #cdd7ff, Dark #a9bbff, Onyx #8ca0fd).

### Reactions (token only)

Default / hover / active / reacted-by-me use `--reaction-background-*`, `--reaction-border-*` and `--reaction-text-*` (reacted border = `--blurple-50` #5865f2). Reaction picker radius 8.

### New-messages bar, jump to present, unread divider (0f481, 908e2)

| Element / state | Value |
|---|---|
| bar base | absolute, inset 8 / 16, min-height 24, 1px `--border-subtle`, opacity .15s |
| new-messages bar | 32 tall, padding-inline 16, top 0, `--brand-500`, white, bottom radius 8, `--elevation-low`; pressed: no shadow, padding-top 1 |
| bar buttons | padding 0 12 (start 4); icon 16 + 8 margin; alt button radius 8, padding 4 8, 600, hover `--control-secondary-background-hover` |
| jump-to-present bar | bottom 28, padding 8 / 12, `--text-default` |
| floating jump container | bottom 84, min 284×44, padding 8 / 16 / 8, `--background-surface-highest`, 1px `--border-normal`, radius 16, `--shadow-medium` |
| jump button | radius 18, padding 6, 24 icon; `--background-surface-high` → hover `--background-base-lowest` (light: `--background-base-lower`) |
| new-messages pill | top 16, padding 9 12 9 16, start radius 18; clear part padding 10 10 10 8, end radius 18, 16 icon |
| error bar | `--notice-background-critical`, `--border-feedback-critical`, `--notice-text-critical`, padding 4 8 |
| load more | 32 tall, 12px / 500 uppercase `--brand-500`, radius 3 |
| date divider | thin top `--border-subtle`; label 12px / 600 / 13, padding 2 4, radius 8, `--text-muted` on chat background |
| unread divider | `--background-feedback-notification`; "NEW" cap 13 tall, 10px bold uppercase white, end radius 4 |

### Scrollers (d125d2 = 99f8c)

| Variant | Value |
|---|---|
| thin | 8px with 2px transparent border (≈4px visible), radius 4, min thumb 40, `--scrollbar-thin-thumb` / `-track` |
| auto | 16px with 4px border (≈8px visible), radius 8, min thumb 40, `--scrollbar-auto-thumb` / `-track` (`--background-mod-muted` track on custom themes) |
| none | 0 |
| fade | thumb hidden until hover / focus-within |
| non-WebKit | `scrollbar-width` thin/auto with the `*-scrollbar-color-*` tokens |

### Tooltip (c36707)

| Element | Value |
|---|---|
| tooltip | 14px / 500 / 16, max-width 190, radius 8, 1px `--border-subtle` (`--border-strong` on custom themes), `--shadow-high`, `--text-default`, z 1002 |
| content | padding 8 12 |
| primary | `--background-surface-high` |
| other variants | grey `--primary-700`, brand `--brand-500`, red `--background-feedback-critical`, green `--green-360`, white text |
| pointer | 10×5 triangle, overlapping 1.5px; hidden on custom themes |

### Context menu (c1e9c4)

| Element / state | Value |
|---|---|
| menu | `--background-surface-higher`, 1px `--border-subtle`, radius 8, `--shadow-high`, max-height 100vh − 32 |
| padding | 8 |
| width | fixed 220; flexible and submenu 188–320 |
| item | min-height 32, padding 8 (compact 4 8), radius 2 (4 when focused); label `--text-strong`; font from text component (14px / 500 inferred) |
| focused | `--interactive-background-hover`, `--text-strong`; keyboard 2px `--border-focus` inset outline |
| active | `--background-mod-subtle` |
| danger | `--text-feedback-critical`; focused `--background-feedback-critical` |
| icon / caret | 20×20 with 8 margin; caret `--text-muted` |
| separator | 1px `--border-subtle`, margin 8 |
| group label | 14px / 500 / 20 `--text-muted` |
| disabled | opacity .5 |

### Popouts and user profile (a16aea, c0bea0, 58495, 875762)

| Element | Value |
|---|---|
| select popout | `--background-surface-higher`, 1px `--border-subtle`, radius 0 0 4 4; options padding 12, 16px / 400 / 20, `--text-subtle`; hover `--interactive-background-hover`; selected `-selected` 500 |
| user popout | 300 wide, `--background-surface-high`, radius 8, `--shadow-border` + `--shadow-high`, max-height 100vh − 20 |
| popout inner | gap 8, padding-bottom 4 |
| banner | 105 tall, radius 8 8 0 0, 1px `--border-muted` bottom |
| avatar | round, at start 16 / top 61 (14 / 59 with a profile theme) |
| body | padding-inline 16 |
| profile theme frame | 2px padding with `--profile-gradient-primary-color` → `--profile-gradient-secondary-color` |
| other sizes | modal 600×780 (banner 210, v2 140); sidebar 340 (banner 120; redesign 300 / 105) |

### Quick switcher (ac6cb0)

| Element | Value |
|---|---|
| container | radius 8, padding 12 20 0 |
| input | 70 tall, 22px / 70, padding 0 12, `--input-background-default`, 1px `--input-border-default`, radius 8 |
| results | area 262; scroller 236, margin-top 16 |
| row | 34 tall, radius 3, 16px / 500, padding 0 10, `--interactive-text-default` (unread `--text-strong`); selected `--interactive-background-selected` |
| row icon | 20 wide, margin-end 5 |
| section header | 12px / 600 / 30, uppercase, .025em, `--interactive-text-default` (consolidated type: 14px / 500) |
| protip | padding-top 10, top 1px `--border-subtle` |

### Buttons, legacy system (201d5)

| Property | Value |
|---|---|
| base | flex centred, 1px `--opacity-white-8` border, radius 8, 14px / 16px, 500, padding 2 16 |
| transitions | filled: background-color and color 170ms ease; outlined: color, background, border-color 170ms |
| disabled | opacity .5, not-allowed |
| submitting | contents hidden, centred spinner |
| sizes | tiny 52×24; small 60×32 (18px line, padding 3 11); medium 100×40 (16px, padding 7 15); large 130×44; min auto (padding 0 4); max 100%×100% 16px; icon padding 4 |
| link underline | 1px background-gradient underline, 1px offset, coloured on hover |

| Look + colour | Default (bg / border / text) | Hover | Active |
|---|---|---|---|
| filled brand | `--control-primary-background-default` / `--control-primary-border-default` / `--control-primary-text-default` | bg `-hover` | bg `-active` |
| filled white / brand-inverted | `--control-overlay-primary-background-default` / (white: `--opacity-8`) / `--control-primary-text-default` | `-hover` | `-active` |
| filled primary / transparent | `--control-secondary-background-default` / `--border-muted` / `--control-secondary-text-default` | `-hover` | `-active` |
| filled red | `--control-critical-primary-background-default` / border / `--white` | `-hover` | `-active` |
| filled green | `--control-connected-background-default` / border / `--white` | `-hover` | `-active` |
| filled link | `--text-link` / — / `--white` | `--blue-500` | `--blue-530` |
| outlined brand | border `--control-secondary-border-default`, text `--control-secondary-text-default` | `--button-outline-brand-background-hover`, border/text hover | `--control-secondary-background-active`, `--button-outline-brand-border-active` |
| outlined primary | border `--control-secondary-border-default`, text `--button-outline-primary-text` | `--control-secondary-*-hover` | `-active` |
| outlined red | `--control-critical-secondary-*-default` | `-hover` | `-active` |
| outlined green | border `--control-connected-border-default` | bg `--control-connected-background-hover` | `-active` |
| link look | brand `--brand-500`, link `--text-link`, red `--text-feedback-critical`, green `--green-360`, primary `--text-default` | underline | — |
| blank | transparent, no border, currentColor, no padding | | |

### Buttons, current system (a22cb0 = 75098)

| Property | Value |
|---|---|
| base | 1px transparent border, radius 8, width min-content, children gap 4 with ellipsis |
| transitions | background-color, color, border-color, opacity 50ms ease-in; .15s ease-out on hover |
| disabled | opacity .5, no pointer events |
| loading | children fade and slide up over .2s, spinner fades in |
| xs | radius 4, min 22×22; with text min-width 60, padding 3 7 |
| sm | min 30×30 (32 with border); with text min-width 60, padding 3 11 |
| md | min 38×38 (40 with border); with text min-width 100, padding 7 15 |
| rounded | `--radius-round` |

| Variant | Tokens |
|---|---|
| primary | `--control-primary-{background,border,text}-{default,hover,active}` |
| secondary | `--control-secondary-*` |
| critical primary / secondary | `--control-critical-primary-*` / `--control-critical-secondary-*` |
| active (connected) | `--control-connected-*` |
| overlay primary / secondary | `--control-overlay-primary-*` / `--control-overlay-secondary-*` |
| icon only | transparent, `--control-icon-only-icon-default`; hover `--control-icon-only-background-hover` |
| input accessory | radius 4, `--icon-strong` |
| expressive | `--control-expressive-background-*`, `--control-expressive-text-*`, blurred glow (10px, 7px reduced motion) |

### Switch (a28278)

| Property | Value |
|---|---|
| track | 48×24, 1px transparent border, radius 16 |
| thumb | 24×24 box, offset −1/−1 |
| settings row | flex space-between, gap 16, min-height 32, padding 8 |
| colours | not applied in CSS (set by script/inline, inferred). Tokens: `--switch-background-default` / `-hover`, `-selected-default` (#5865f2) / `-selected-hover` / `-active`; `--switch-border-*`; `--switch-thumb-background-default` (#fff dark, #62636d light) / `-selected`; `--switch-thumb-icon-default` / `-active` |
| disabled | not-allowed |

### Checkbox (714a9) and radio (64e61)

| Control | Values |
|---|---|
| checkbox box | 20×20, 1px border, radius 4; text inset 32 (20 + 12) |
| checkbox colours | default `--checkbox-background-default` / `--checkbox-border-default`; hover `-hover`; selected `--checkbox-background-selected-default` (#5865f2) / `--checkbox-border-selected-default`; mark `--checkbox-icon-active` |
| checkbox motion | mark draws in .3s cubic-bezier(.65,0,.83,.83), out .12s |
| radio | 20px, ring stroke 2 in `--radio-border-default`, fill `--radio-background-default`; hover `-hover`; selected `--radio-background-selected-default`, dot `--radio-thumb-background-active`; in 225ms / dot 333ms, out 160 / 250ms |
| radio group | gap 16, padding 8 0 4, option radius 8 |
| disabled | opacity .5 |

### Slider (ec237e = d061ce)

| Element | Value |
|---|---|
| root | 24px tall (+24 with marks) |
| bar | 4px, radius 4, `--slider-track-background`, inset 5 |
| fill | `--background-brand`, 1px white @ 10% border |
| grabber | 16px circle, `--white`, 1px `--border-normal`, `--shadow-low`, ew-resize cursor |
| marks | label 12px / 16 / 500 `--text-subtle` (default value `--text-feedback-positive`); tick 2×24 radius 12 |
| disabled | opacity .6 |
| mini (legacy) | 6px bar, 12px grabber |

### Text inputs

| Variant | Values |
|---|---|
| current wrapper (72c38) | `--input-background-default`, 1px `--input-border-default`, radius 8, `--input-text-default`, gap 4, border .1s |
| states | hover `--input-border-hover`; focus 2px outline at −2 in `--input-border-active`; read-only `--input-border-readonly`; error `--input-border-error-default` + `--input-background-error-default`; disabled .5 |
| current field (75098) | height 40 (md) / 32 (sm), padding-inline 12, placeholder `--input-placeholder-text-default`; clear button `--icon-subtle` → `--icon-strong` |
| legacy (0ed4f) | 44 tall, padding 12 10, radius 8, 16px, `--text-default`; focus `--text-link`; error 2px `--text-feedback-critical`; success `--green-360`; .2s |
| copy input (fffc15) | 40 tall, radius 8, 16px / 20, padding 10 |
| select (a16aea) | min-height 40 (sm 32), padding 8 12 8 8 |

### Modal (49fc1 current; ab9bdf legacy)

| Element | Value |
|---|---|
| root | `--modal-background`, 1px `--border-normal`, radius 12 (`--shadow-medium` when shadowed) |
| sizes | small 442 wide (min-h 220, max-h 720); medium 602 (400 / 800); large 800–962 (min-h 400) |
| header / footer | padding 16 24; header bottom 0, top radius 12; footer top 16, `--modal-footer-background`, bottom radius 12 |
| content | padding-inline 24, top 8 |
| close | 24 icon, padding 4, `--icon-strong` at .5 → 1 + `--interactive-text-hover`, .2s |
| mobile (≤485 wide or ≤550 tall touch) | full width; fullscreen drops border and radius |
| backdrop | centred with 24 vertical padding, `--black` (opacity set by script, inferred) |
| legacy | radius 5, `--legacy-elevation-border` + `--legacy-elevation-high`; widths 440 / 600 / 800–960 |

### Dividers

| Element | Value |
|---|---|
| form / menu divider | 1px `--border-subtle` (some variants 8px vertical margin) |
| labelled divider | flex, gap 8, 1px lines both sides |
| chat header divider | 1×24, margin 0 4 |

### Focus ring

Global 4px box-shadow ring in `--focus-primary` (undefined in CSS, so the fallback #00b0f4 applies), radius 4.

## 4. Typography scale

Text variants are hashed classes repeated in about 25 files. Sizes in px (a rem twin exists under `.fontScaling`); line heights are unitless, computed px in brackets. Family `--font-primary` unless noted.

| Variant | Size | Line height | Weight | Letter spacing | Other |
|---|---|---|---|---|---|
| text-xxs/{normal,medium,semibold,bold} | 10 | 1.2 (12) | 400 / 500 / 600 / 700 | — | |
| text-xs/* | 12 | 1.3333 (16) | 400–700 | — | |
| text-sm/* | 14 | 1.2857 (18) | 400–700 | — | |
| text-md/* | 16 | 1.25 (20) | 400–700 | — | |
| text-lg/* | 20 | 1.2 (24) | 400–700 | — | |
| heading-sm/{normal…extrabold} | 14 | 1.2857 (18) | 400–800 | — | |
| heading-md/* | 16 | 1.25 (20) | 400–800 | — | |
| heading-lg/* | 20 | 1.2 (24) | 400–800 | — | |
| heading-xl/* | 24 | 1.25 (30) | 400–800 | — | |
| heading-xxl/* | 32 | 1.25 (40) | 400–800 | — | |
| heading-deprecated-12/* | 12 | 1.3333 (16) | 400–800 | — | |
| redesign/heading-18/{medium,semibold,bold} | 18 | 1.3333 (24) | 500 / 600 / 700 | — | |
| experimental/heading-xs | 14 | 18 | 500 / 600 | — | |
| experimental/heading-sm | 16 | 20 | 500 / 600 | — | |
| experimental/heading-md | 18 | 22 | 500 / 600 | — | |
| experimental/heading-lg | 20 | 24 | 500 / 600 | — | |
| experimental/heading-xl | 24 | 32 | 500 / 600 | — | |
| experimental/heading-xxl | 32 | 40 | 500 / 600 | — | |
| eyebrow | 12 | 1.3333 (16) | 700 | .02em | uppercase |
| code | 12 | 1.3333 (16) | 700 | — | `--font-code` |
| display-sm / md / lg | 20 / 34 / 44 | 20 / 36 / 42 | 800 | — | `--font-headline` |
| experimental/display-xs / sm / md / lg | 16 / 24 / 32 / 44 | 18 / 26 / 34 / 44 | 700 | — | `--font-nitro`, uppercase |
| nitro-xs | 14 | 18 | 800 | — | italic uppercase |
| nitro-sm / md / lg | 20 / 34 / 44 | 20 / 36 / 42 | 800 | — | headline, italic uppercase |
| experimental/nitro-xs…lg | 16 / 24 / 32 / 44 | 18 / 26 / 34 / 44 | 700 | — | nitro, italic uppercase |

Under `.mana-type-consolidation`: bold and extrabold become 600; heading normal becomes 500; heading-xl line height 32; redesign heading-18 line height 22; eyebrow becomes 14 / 18, 500, no uppercase, normal spacing; display and nitro switch to `--font-nitro` 700 at the experimental sizes.

Families: `--font-primary` "gg sans" → Noto Sans, Helvetica Neue, Helvetica, Arial; `--font-headline` "ABC Ginto Nord"; `--font-nitro` "ABC Ginto Discord Nord"; `--font-code` "gg mono", Source Code Pro, Consolas … monospace; marketing faces "ABC Ginto Discord" / "… Nord"; clan faces Fraunces and Corinthia. Weight tokens: 300, 400, 500, 600, 700, 800, 900 (light → black). Language overrides (`:root:lang`) only change families: bg/el/ru/uk drop Ginto from the headline stack; ko adds Apple SD Gothic Neo, NanumBarunGothic, Malgun Gothic, Gulim, Dotum; ja adds Hiragino Sans, Hiragino Kaku Gothic ProN, Meiryo, Osaka, MS PGothic; zh-CN adds Microsoft YaHei, SimSun; zh-TW adds Microsoft JhengHei, Microsoft YaHei.

## 5. Icons

How icons are drawn: no stylesheet sets `fill` or `stroke` to currentColor on ordinary UI icons (only two forced-colours rules do). CSS sets `color`, a few older icons set `fill` directly, and focused context-menu items recolour `path` fills, so Discord's icons are **filled** shapes coloured through currentColor (inferred from that evidence; the fill attribute lives in the SVG markup). Checkbox and radio rings are the only stroked SVGs.

| Area | Element | Size (px) | Colour tokens | Fill / stroke |
|---|---|---|---|---|
| Chat header | toolbar icon | 20 (in 32 wrapper, gap 8) | `--icon-muted` → hover `--icon-subtle` → selected `--icon-strong`; static `--channel-icon`; disabled .6 | filled |
| Chat header | channel-type icon | 20 tall | `--channel-icon` | filled |
| Chat header | icon badge | 8 (10 tall with count) | `--background-feedback-notification` / `--background-brand` | — |
| Channel list (DM rows) | link icon | 20 | `--icon-muted`, selected `--icon-strong` | filled |
| Channel list | close / favourite | 16 | row text colour; opacity .7 → 1 | filled |
| User panel | mic / deafen / settings | 20 (inferred) in 32 button | `--icon-subtle`; hover `--interactive-text-hover`; muted `--icon-feedback-critical` on `--opacity-red-12` | filled |
| User panel | split chevron | 16 in 16×32 | inherits; hover bg `--background-mod-muted` | filled |
| User panel (voice) | action icon | 20 | `--control-secondary-text-default` | filled |
| Message hover toolbar | action icon | in 24 content box (32 button) | `--interactive-text-default` → `--interactive-text-hover`; danger `--control-critical-secondary-text-*` | filled |
| Composer | attach, gift, GIF, sticker, apps | 20 (32 button) | `--interactive-text-default` → hover `--interactive-text-hover`, open `--interactive-text-active` | filled |
| Composer | emoji button | sprite set inline | greyscale mask `--interactive-text-default`, colour on hover | raster mask |
| Member list | owner crown / premium | 14 | `--text-feedback-warning` | filled |
| Server rail | guild / home tile | 40 (44 refresh) | `--text-default` on `--background-mod-subtle`; hover/selected `--white` on `--background-brand` | filled |
| Server rail | Discord logo (home) | 28×20 | inherits | filled |
| Server rail | add server / discover | 20 in 40 tile | as guild tile | filled |
| Server rail | folder | 40, radius 12 | `--custom-folder-color` else `--background-brand` | filled |
| Server rail | focus ring | 8 stroke | `--blue-345` | stroked mask |
