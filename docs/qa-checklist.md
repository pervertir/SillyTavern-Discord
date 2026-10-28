# QA checklist

Screenshot QA on the clean test profile only (SillyTavern's sample characters, never a real
library). Variants: desktop 1440×900 and phone 390×844, in Dark, Light, Onyx and one Nitro
gradient (Chroma Glow). Reference: docs/discord-ui-notes.md (Discord's own stylesheet
values) and Discord's current client. Status: ✅ right · ❌ wrong (defect) → 🔧 fixed (commit).
"Simpler" notes what clunky SillyTavern flow was replaced.

## Batch 1: chat core

| Component | Status | Defect / fix | Simpler |
|---|---|---|---|
| Message, cozy layout (40px avatar, name 16/500, time 12/500 "Today at …") | ✅ | | |
| Grouped follow-ups (same author ≤7 min) with hover time in the gutter | ✅ | | |
| Date divider | ✅ | | |
| Markdown: code block, inline code, quotes, italics | ✅ | | |
| Hover action bar (surface-highest, 8px radius, 32px cells) | ✅ | | |
| Header (@name, status dot, tools) | ❌→🔧 | Away character's status cut-out covered the whole header and blocked its buttons (a96a5fa) | |
| Header tooltips | ✅ | | |
| Message box (+, gift, GIF, sticker, emoji) | ✅ | | Wand moved to the emoji button |
| "X is typing…" with Discord's three dots | ❌→🔧 | Was a plain line; now Discord's pulsing dots, 1/2/3/several names (dfabcf6) | Streaming placeholder "..." hidden until words arrive |
| Stop generating | ✅ | Esc or the red stop button | |
| Inline edit | ❌→🔧 | No hint, no Enter to save; now "escape to cancel • enter to save", Enter saves, Esc cancels | No more hunting for the ✓ button |
| ↑ edits your last message | ❌→🔧 | SillyTavern's ↑ edited the very last message (often the bot's); now yours, as Discord | |
| Right-click a message | ❌→🔧 | Browser menu; now Reply, Edit Message, Copy Text, Regenerate, Continue, Delete Message | One menu in place of the tiny icon row and the edit-mode trash |
| Reply | ❌→🔧 | Didn't exist; quotes the message into the box | |
| Delete confirmation | ✅ | SillyTavern's confirm dialog in Discord's modal style | |
| Swipe pager | ✅ | Quiet pager under the last reply | |
| Chat history dialog | ✅ | | |
| + menu | ✅ | Discord floating menu | |
| Toasts | ✅ | | |
| Quick switcher | ✅ | | |
| DM context menu | ✅ | | |
| Rail tooltip | ✅ | | |

## Batch 2: navigation — pending
## Batch 3: short messages and sounds — sounds ✅ (1646b82); short messages pending
## Batch 4: settings and controls — pending
## Batch 5: overlays and editors — pending
## Batch 6: home pages and phone — pending
## Batch 7: final sweep — pending
