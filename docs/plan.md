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
4. **Link previews** as Discord embeds (title, site, description). This is opt-in, since it fetches pages.
5. **"(edited)"** after edited messages.
6. **Pinned Messages:** the pin icon shows a list of pinned messages (SillyTavern checkpoints and bookmarks), with Jump.
7. ✅ **Search in chat** (done, desktop). Type in the header search (or Ctrl/⌘+F) and press Enter: results open on the right, newest or oldest first, words marked, `from:name` to filter; Jump scrolls to the message, loading older ones if needed. Still to do: a search button on phones.
8. **Emoji picker:** a real Discord-style picker on the emoji button, with recent emoji. Extensions move to their own button.

### People and servers
9. ✅ **Profile popout** (done). Clicking a picture or name in the chat, or a member in the list, opens Discord's card beside it (banner, picture, status, About Me, Member Since, Mutual Servers, View Full Profile, and a Message box that sends in their DM); your own messages open your persona card with Edit Profile. Phones keep the profile sheet.
10. **Server icons from the group's picture,** server folders, and dragging to reorder servers and DMs.
11. **Channels:** rename a channel (rename the chat) and delete it with confirmation from its menu; a "Create Channel" dialog in Discord style.
12. **Member roles:** group members shown by role (talking now, muted, others).

### Settings and controls
13. **AI Config, Context and Instruct templates,** rebuilt as Discord forms: plain labels, sliders with markers, advanced options folded away.
14. **Connections** as Discord's connection cards: pick a provider, enter the key, test.
15. **Notifications settings page** in the settings sidebar, so the sound options sit where Discord keeps them (they're in the extension panel today).
16. **Keybinds page** with every shortcut, including mute (Ctrl/⌘+Shift+M) and deafen (Ctrl/⌘+Shift+D), which are new.

### Platform
17. **Real-device phone test:** iPhone Safari and Android Chrome, keyboard open, safe areas, home-screen (PWA) mode.
18. **Accessibility:** screen-reader labels, contrast in every theme, full keyboard-only use.
19. **Deep's real library at scale:** check speed and layout by counting elements only, never screenshots, with hundreds of characters and long chats.
20. **First run:** no characters, no chats, no AI connected; each screen says what to do next.
21. **Translations:** route the theme's own text through SillyTavern's translator for other languages.

## Order

1–3, then 9, 7, 6, 8, 13–16, the rest; ship each piece and update Deep's install as it lands.
