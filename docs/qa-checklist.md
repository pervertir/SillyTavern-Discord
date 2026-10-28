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

## Batch 2: navigation

| Component | Status | Defect / fix | Simpler |
|---|---|---|---|
| Server rail, pill, tooltips, Add a Server, Discover | ✅ | | |
| DM rows: hover, selected, close × | ✅ | | |
| Unread DM (bold + pill) | ❌→🔧 | Didn't exist; replies that land while you're away mark the DM | |
| Tab title "(n) Discord" and tab icon badge | ❌→🔧 | Didn't exist | |
| Desktop notifications when away | ❌→🔧 | Didn't exist; opt-in switch asks the browser | |
| Your status (Online, Idle, Do Not Disturb, Invisible) | ❌→🔧 | Panel was always "Online"; now Discord's status menu with shapes and notes; DND silences pings and notifications | |
| Switch Accounts (personas) | ❌→🔧 | Was buried in Persona Management; now in the status menu | Two clicks instead of a full page |
| Edit Profile | ✅ | In the status menu, opens My Account | |
| Channel list and categories | ✅ | | |
## Batch 3: short messages and sounds

| Component | Status | Defect / fix | Simpler |
|---|---|---|---|
| Sounds: ping, online chime, mute and deafen tones, deafen silences, settings | ✅ | 1646b82 | |
| Long replies as short messages | ❌→🔧 | Were one wall of text; now parts (shared splitter), each its own row with hover and time | Reads like texting |
| Fresh reply comes in part by part with typing dots between | ❌→🔧 | First version cleared the dots straight away; reveal now starts after the reply's own handlers | |
| Streamed reply | ✅ | Shown whole (it was already seen coming in), then split | |
| Edit a split reply | ✅ | Opens the whole original; saving re-splits | |
| Swipe, delete, regenerate on split replies | ✅ | Work on the whole message (SillyTavern's data is untouched) | |
| Model icon after the time | ❌→🔧 | SillyTavern's model icon; hidden | |
| Setting "Split replies into short messages" | ✅ | On by default; off puts replies back whole at once | |
## Batch 4: settings and controls

| Component | Status | Defect / fix | Simpler |
|---|---|---|---|
| Settings sidebar, one topic per page, close + ESC | ✅ | | Long ST pages split by topic |
| Switching sections | ❌→🔧 | Chat flashed through while SillyTavern swapped menus (2f2ae2c) | |
| Clicks inside settings | ❌→🔧 | SillyTavern's outside-click closer shut the settings (6cde172) | |
| Switches, selects, text fields, textareas, sliders, buttons | ✅ | Discord's controls | |
| Radio choices | ✅ | Discord radio cards on the Appearance page | |
| Appearance: theme swatches, Nitro colors | ✅ | | |
| Message Display: Cozy / Compact | ❌→🔧 | Was only in the extension panel; now radio cards on Appearance; compact shows the clock only | |
| Chat font scaling 12–24px | ❌→🔧 | Didn't exist | |
| Space between message groups 0–24px | ❌→🔧 | Didn't exist | |
| 24-hour time | ❌→🔧 | Didn't exist | |
| Keyboard focus rings | ❌→🔧 | Mixed; now Discord's blue ring on Tab | |
| Keybinds list (Ctrl/⌘+/) | ✅ | | |
| ↑ edits last message, Esc cancels edit | ✅ | Batch 1 | |
## Batch 5: overlays and editors

| Component | Status | Defect / fix | Simpler |
|---|---|---|---|
| Modals (confirm, chat history, keybinds) | ✅ | Discord modal: surface, 12px radius, border | |
| Right-click: messages, DMs, channels, servers | ✅ | Messages added in batch 1 | |
| Long press on phones | ❌→🔧 | iOS has no long-press menu; now a 0.5s hold opens the same menu | |
| "/" command picker | ❌→🔧 | Showed every argument in monospace; now name + one-line description, Discord colors | Scannable list |
| Not connected to an AI | ❌→🔧 | Only a placeholder warning; now Discord's red notice bar with Connect | One click to Connections |
| Jump to Present | ❌→🔧 | Didn't exist; shows when scrolled far up | |
| Toasts | ✅ | | |
| Profile (character editor), Server Settings (group editor), lorebooks as channels, personas | ✅ | Earlier passes | |
| Other extensions' settings | ✅ | Discord cards in Extensions | |
## Batch 6: home pages and phone

| Component | Status | Defect / fix | Simpler |
|---|---|---|---|
| Friends: Online, All, Add Friend | ✅ | | |
| Friends: Pending, Blocked | ➖ | Not added: they mean nothing for characters | Favorites tab instead |
| Friends empty lists | ❌→🔧 | Showed a bare "— 0"; now a plain sentence saying what to do | |
| Discover | ✅ | | |
| Notifications (phone) | ✅ | | |
| Nitro / Shop rows | ✅ | Open Extensions / Backgrounds | |
| Quick switcher prefixes @ # * | ✅ | | |
| Phone: home, chat, tabs, You list, Appearance, Discover | ✅ | No sideways scrolling at 390px | |
| Phone: "User Settings" heading | ❌→🔧 | Touched the top edge; now padded | |
| Phone: tap the chat title | ❌→🔧 | Did nothing (no side panel); now opens the profile sheet | |
| 1001–1100px windows | ❌→🔧 | Profile panel hidden, so avatar clicks did nothing; now the sheet | |
| Tablet 768px, switch at 1000/1001px, 1280px | ✅ | No overflow; layout swaps cleanly | |
## Batch 7: final sweep

| Check | Status | Notes |
|---|---|---|
| Dark, Light, Onyx, Chroma Glow on desktop; phone | ✅ | qa/after (local, gitignored) |
| Light theme code blocks | ❌→🔧 | Highlight colors were for dark backgrounds (text vanished); Discord's light code colors added |
| 1,000-message chat | ✅ | Opens in 0.36s (100 shown, 50 replies split) |
| Streaming (300 updates) | ✅ | Style 46ms / layout 95ms with the theme, vs 133ms / 506ms without it |
| Scrolling the loaded chat | ✅ | Style 198ms, layout 40ms over the whole scroll |
| Widths 768, 1000, 1001, 1100, 1280 | ✅ | No overflow |
| Chat background image | ❌→🔧 | Always hidden; now a switch shows it behind a see-through chat |
| Theme off restores SillyTavern exactly | ✅ | Compared with a fresh load |
| Console | ✅ | No errors in any capture |
| README screenshots | ✅ | Retaken from the clean profile |
