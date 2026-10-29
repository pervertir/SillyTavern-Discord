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
10. ◐ **Server icons from the group's picture** (done). Still to do: server folders, and dragging to reorder servers and DMs.
11. **Channels:** rename a channel (rename the chat) and delete it with confirmation from its menu; a "Create Channel" dialog in Discord style.
12. ✅ **Member roles** (done): Online, Muted (SillyTavern's disabled members, red mic) and Offline.

### Settings and controls
13. ✅ **AI Config, Context and Instruct as Discord forms** (done). Slider rows with visible explanations and value boxes; everyday samplers first, the rest behind "Show all samplers" (Mirostat and other groups fold with their heading); an Instruct Mode switch row at the top of the Instruct page; Discord's uppercase field labels on the formatting pages.
14. ✅ **Connections** (done). A card for the connection in use (logo, provider, model, live status), and providers as logo tiles (API, then Chat Completion provider or Text Completion backend) built from SillyTavern's own lists; SillyTavern's key/model/Connect form follows below.
15. ✅ **Notifications page** (done). Settings > App Settings > Notifications: desktop notifications and every sound as Discord switch rows, with volume; kept in step with the extension panel.
16. ✅ **Keybinds page** (done). Every shortcut by group with key chips; mute (Ctrl/⌘+Shift+M) and deafen (Ctrl/⌘+Shift+D) now work.

### Platform
17. **Real-device phone test:** iPhone Safari and Android Chrome, keyboard open, safe areas, home-screen (PWA) mode.
18. **Accessibility:** screen-reader labels, contrast in every theme, full keyboard-only use.
19. **Deep's real library at scale:** check speed and layout by counting elements only, never screenshots, with hundreds of characters and long chats.
20. ✅ **First run** (done): with no characters, Friends says where to start, with Create and Import buttons; no AI connected already shows the not-connected bar.
21. **Translations:** route the theme's own text through SillyTavern's translator for other languages.

## Order

1–3, then 9, 7, 6, 8, 13–16, the rest; ship each piece and update Deep's install as it lands.
