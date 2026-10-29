# Discord theme: the plan

Goal: SillyTavern that looks, sounds and behaves like current Discord, cleaner than both where
it helps, with every SillyTavern function still reachable. Test only on the clean profile;
update Deep's install after every push.

## Done

- **Look:** the 2025 redesign layout. Dark, Ash, Onyx and Light themes, all 23 Nitro gradients, the real Discord logo, Discord-style icons throughout, Discord's fonts and colours (docs/discord-ui-notes.md).
- **Navigation:** server rail (groups as servers), DMs, channels, Friends, Discover, Notifications (phone), quick switcher, your status menu with Switch Accounts, unread badges, desktop notifications.
- **Chat:** cozy and compact layouts, grouping, date lines, hover bar, right-click message menu, Reply, Enter/Esc editing, ↑ to edit, typing dots, short split messages revealed one by one, presence (online, idle, Do Not Disturb, offline) with held replies, sounds, Jump to Present, the not-connected bar, the "/" command picker.
- **Settings:** full-screen Discord settings split into one-topic pages; Appearance (themes, colours, display, font size, spacing, 24-hour time); Profile and Server Settings editors; lorebooks as channels.
- **Customize:** Settings > App Settings > Customize changes every colour, font, size, shape, spacing, visible part, name colour, chat background and animation, plus custom CSS; live, with a preview, per-section reset, export and import (shared format: AI/shared/customize-spec.md).
- **One theme at a time:** turning Discord on turns off our other themes live and disables other theme extensions (with Reload); SillyTavern's UI theme preset and Custom CSS pause while it's on (lib/theme-exclusive.js, shared: AI/shared/theme-exclusive.md).
- **Phones:** Home, Notifications and You tabs; sheets; long-press menus.
- **QA:** 87 components checked and fixed (docs/qa-checklist.md).

## Still to do, including what may have been missed

### Messages
1. ✅ **Reactions** (done). Add a reaction from the hover bar or menu. They're stored in the message's extra data, so they survive reloads; the prompt is unaffected.
2. ✅ **Spoilers** (done). `||text||` hides until clicked (emoji and formatting inside too) and is never cut by split replies; `-# text` lines show as small subtext; masked links `[text](url)` already come from SillyTavern's formatter.
3. ✅ **Images and files** (done). Attached and generated pictures and videos as Discord attachments with a hover toolbar (SillyTavern's zoom, caption and delete kept); pictures open in the viewer with arrows between a message's pictures; files as Discord file cards with download and view.
4. ⏸ **Link previews**: on hold. A browser page can't fetch other sites' pages (CORS), and SillyTavern's CORS proxy is off by default and a security risk to turn on; revisit only if Deep wants that.
5. ✅ **"(edited)"** (done): after a message whose text actually changed, with the time as a tooltip; kept in the message's extra data.
6. ✅ **Pinned Messages** (done). "Pin Message" in the message menu; the header's pin icon opens the Pinned Messages list (newest first) with Jump and Unpin; a small pin marks pinned messages. Pins live in the message's extra data (never in the prompt). Pinning the chat itself moved to the list's footer, the sidebar menu and Ctrl/⌘+P.
7. ✅ **Search in chat** (done, desktop and phone: a magnifier in the phone header). Type in the header search (or Ctrl/⌘+F) and press Enter: results open on the right, newest or oldest first, words marked, `from:name` to filter; Jump scrolls to the message, loading older ones if needed. Still to do: a search button on phones.
8. ✅ **Emoji picker** (done). The emoji button (and Ctrl/⌘+E) opens Discord's picker: search, category rail, Frequently Used, name preview; a pick goes in at the cursor, Shift+click adds several. Extensions moved to their own Apps button beside it.

### People and servers
9. ✅ **Profile popout** (done). Clicking a picture or name in the chat, or a member in the list, opens Discord's card beside it (banner, picture, status, About Me, Member Since, Mutual Servers, View Full Profile, and a Message box that sends in their DM); your own messages open your persona card with Edit Profile. Phones keep the profile sheet.
10. ✅ **Server icons, folders and order** (done). Group pictures as icons; drag servers to reorder, onto each other to make a folder (2×2 icons closed, tinted strip open), folders rename/recolor/ungroup from their menu; Move Up/Down and folder options in each server's menu for keyboard use. DMs stay in recency order, as in Discord.
11. **Channels:** rename a channel (rename the chat) and delete it with confirmation from its menu; a "Create Channel" dialog in Discord style.
12. ✅ **Member roles** (done): Online, Muted (SillyTavern's disabled members, red mic) and Offline.

### Settings and controls
13. ✅ **AI Config, Context and Instruct as Discord forms** (done). Slider rows with visible explanations and value boxes; everyday samplers first, the rest behind "Show all samplers" (Mirostat and other groups fold with their heading); an Instruct Mode switch row at the top of the Instruct page; Discord's uppercase field labels on the formatting pages.
14. ✅ **Connections** (done). A card for the connection in use (logo, provider, model, live status), and providers as logo tiles (API, then Chat Completion provider or Text Completion backend) built from SillyTavern's own lists; SillyTavern's key/model/Connect form follows below.
15. ✅ **Notifications page** (done). Settings > App Settings > Notifications: desktop notifications and every sound as Discord switch rows, with volume; kept in step with the extension panel.
16. ✅ **Keybinds page** (done). Every shortcut by group with key chips; mute (Ctrl/⌘+Shift+M) and deafen (Ctrl/⌘+Shift+D) now work.

### Platform
17. **Real-device phone test:** iPhone Safari and Android Chrome, keyboard open, safe areas, home-screen (PWA) mode.
18. ✅ **Accessibility** (done): every control named, every picture with alt text, WCAG AA text contrast in Dark/Ash/Onyx/Light (Ash's channel color raised), visible focus on every control by keyboard; checked on the main screen, settings pages, profile card, menus and emoji picker, and part of `npm run check` (test/e2e/a11y.mjs).
19. ✅ **Speed at scale** (done): measured on a synthetic library (300 characters, 20 servers, a 1,000-message chat; Deep's own library was only counted, 14 characters). Chat open 0.72→0.57 s, loading 1,000 messages 2.14→1.60 s, member list 189→97 ms, load 2.2→1.8 s; scrolling (p95 18 ms) and typing (33 ms) match SillyTavern without the theme. Fixes: messages already drawn are skipped, context built once per task, label writes only on change, settings defaults filled once.
20. ✅ **First run** (done): with no characters, Friends says where to start, with Create and Import buttons; no AI connected already shows the not-connected bar.
21. ✅ **Translations** (done): every word the theme shows goes through `t()`, gathered in `locales/en.json` (tools/strings.mjs) and translated into all 16 of SillyTavern's other languages; the theme follows SillyTavern's language setting; Arabic reads right to left. Unit tests fail on a missing string; the check fails if any theme word shows in English while SillyTavern is in German.

## Order

1–3, then 9, 7, 6, 8, 13–16, the rest; ship each piece and update Deep's install as it lands.
