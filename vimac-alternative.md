# Vimac alternatives: what to use now that Vimac is Homerow

Source: https://nomousemode.com/vimac-alternative  
Updated: 2026-10-31 · Author: Ahmed Gagan (maker of No Mouse Mode)

Vimac, the free open-source app that became Homerow, hasn't been updated since 2022. **Homerow is its official successor; No Mouse Mode, Shortcat, Scoot, Wooshy and macOS's own tools are the other options.**

> **Short answer:** Vimac is no longer developed. Its README says "Vimac is now Homerow", and its last code change was on December 31, 2022. If you want the direct successor, that's [Homerow](https://www.homerow.app) ($49.99 once, free to try). If you want Vimac's hint labels and scroll mode plus a full keyboard mouse, try [No Mouse Mode](https://nomousemode.com/) ($19.99 once for one Mac). Scoot is the free, open-source pick. Shortcat and Wooshy suit people who'd rather type a button's name, and macOS's built-in tools are free.

## What happened to Vimac?

[Vimac](https://github.com/nchudleigh/vimac) was a free, open-source (GPL-3.0) app for "keyboard-driven navigation" on macOS, with about 3,690 GitHub stars. Its README now says:

- **"Vimac is now Homerow"**, described as "a refined, sleeker, more performant successor of Vimac."
- The **last commit was December 31, 2022**. There are no GitHub releases.
- The repository isn't archived, but nothing has changed since. vimacapp.com didn't respond when we checked in October 2026, and we found no Homebrew cask.

So if Vimac is acting up on your Mac, or you're wondering whether it's safe to keep relying on it, the honest answer is that no fixes are coming. It's time to pick a maintained replacement.

## What Vimac users miss

Vimac had two modes, and most people switching want both back:

### Hint mode

Hold Space (the default) and hint text appears on the elements in the frontmost window. Type a hint to click, double-click or right-click that element.

### Scroll mode

A red border marks the active scroll area, and H J K L scroll it, Vim style.

The rest of this page maps those two modes onto each option available today.

## How each option maps to Vimac

As of October 2026. "Not listed" means the app's own site or README doesn't mention it.

| App | Like hint mode | Like scroll mode | Price | Maintained? |
|---|---|---|---|---|
| Homerow | Labels, plus search | Scroll mode | $49.99 once, free to try | Yes, 1.5.3 (March 2026) |
| **No Mouse Mode** | Click labels, plus type to click | Scroll areas, J/K to scroll | $19.99 once (1 Mac), no trial | Yes, 2.0.0 |
| Shortcat | Type to search; labels after 2 seconds | Not listed | Free download (no price on site) | Last updated July 2025 (beta) |
| Scoot | Element mode in the focused window | Can scroll | Free, open source | Yes, v1.3 (March 2026) |
| Wooshy | Type to search and click | Not listed | Free with naps; $3.88/mo or $46.28/yr | Yes |
| macOS built-ins | Voice Control "Show numbers" | Not a dedicated mode | Free | Part of macOS |

## Homerow: the official successor

[Homerow](https://www.homerow.app) is the app Vimac's README points to. Its site shows labels, search and scroll, and version 1.1.0 added extra scroll-mode commands. It's actively maintained (1.5.3 came out in March 2026) and needs macOS 13 or later.

The big change for Vimac users is price: Homerow is **$49.99 once**, covering all your personal Macs and future updates, and it isn't open source. It's free to try, with a reminder every 50 activations. If you liked Vimac and just want it modernised, this is the natural next step. Our [Homerow vs No Mouse Mode comparison](https://nomousemode.com/no-mouse-mode-vs-homerow) has the full feature table.

## No Mouse Mode: Vimac's two modes, plus a keyboard mouse

[No Mouse Mode](https://nomousemode.com/) covers both Vimac modes and then fills the gaps that hint labels leave.

- **Hint mode → click labels.** `⇧⌘Space` labels every button, link, tab and menu, including the menu bar and the Dock. Type the letters to click. Hold Shift with the last letter to right-click or Option to double-click, just like Vimac's hint actions, or Command for a Command-click. Labels for a window stay the same each time.
- **Scroll mode → scroll areas.** `⇧⌘J` numbers each scrollable pane. Pick one, then J and K scroll, Space pages, and T / B jump to the top or bottom.
- **Type to click.** `⇧⌘/` lets you type part of a button's name instead of a hint (initials work).

Beyond that, press `⇧⌘M` and the keyboard becomes a mouse: W A S D move the pointer smoothly, Space clicks or drags, Return right-clicks, and the arrow keys scroll. `E` opens a 3×3 jump grid that reaches anywhere in two or three presses, even in apps with no labels. An optional on-device text recognition mode adds labels in apps that don't describe their buttons to macOS. Every key can be remapped, and a Practice window with nine lessons gets you fluent.

**Trade-offs:** there's no free trial (the site has interactive demos with the same keys), all sales are final, it isn't open source, and it needs macOS 14 Sonoma or later.

## Scoot: the free, open-source option

If Vimac's open-source license mattered to you, [Scoot](https://github.com/mjrusso/scoot) is the closest in spirit. It's BSD-3-Clause and updated in March 2026. `⇧⌘J` shows labels on buttons and links in the focused window, which is close to Vimac's hint mode. `⇧⌘K` adds a grid across your screens and `⇧⌘L` a freestyle mode where you nudge the cursor with macOS, Emacs or vi text shortcuts. It can move, click, drag and scroll.

Its README says it runs on macOS 11 and 12 and doesn't mention newer versions, so try it on your Mac before you rely on it. Note that its `⇧⌘J` default is the same as No Mouse Mode's scroll areas shortcut; both apps let you change it.

## Shortcat and Wooshy: type the name instead

If you'd rather type what you see than learn hint letters, two apps are built around search.

- **[Shortcat](https://shortcat.app)** is a command palette: press `⌘⇧Space`, type "ok" to click an OK button. After two seconds it shows one- to three-letter labels, so it also works a bit like hint mode. It supports right, double and modifier clicks, and window and menu search. It's a 0.x beta, last updated July 2025, and a free download. See [No Mouse Mode vs Shortcat](https://nomousemode.com/no-mouse-mode-vs-shortcat).
- **[Wooshy](https://wooshy.app)** searches the whole interface, including the Dock and menu bar, and clicks. The free version "takes some random naps"; a subscription ($3.88 a month or $46.28 a year) keeps it running all the time. It needs macOS 14.6.

Neither lists a scroll mode, so you'd scroll with the keyboard the usual way.

## macOS built-ins: free, if slower

- **Voice Control** is the closest built-in to hint mode: say "Show numbers", then "Click" and a number. "Show grid" adds a numbered grid.
- **Full Keyboard Access** lets you Tab between controls and press Space. See our [Full Keyboard Access guide](https://nomousemode.com/full-keyboard-access-mac).
- **Mouse Keys** moves the pointer with keys, but you can't type text while it's on. Compared in [No Mouse Mode vs Mouse Keys](https://nomousemode.com/no-mouse-mode-vs-mouse-keys).

## Which one should a Vimac user pick?

- **You want Vimac, but maintained:** Homerow.
- **You want hint and scroll modes plus pointer movement, dragging and a grid:** [No Mouse Mode](https://nomousemode.com/).
- **You want free and open source:** Scoot.
- **You'd rather type names than hints:** Shortcat or Wooshy.
- **You need something right now at no cost:** Voice Control or Full Keyboard Access.

Came to Vimac from the browser? Read [Vimium for the whole Mac](https://nomousemode.com/vimium-for-mac). For the full field, see [Homerow alternatives](https://nomousemode.com/homerow-alternatives).

**Hint labels and scroll mode, still maintained** No Mouse Mode is $19.99 once for one Mac, with free updates and no subscription. Price and checkout: https://nomousemode.com/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).

## FAQ

### Is Vimac dead?

Effectively, yes. Vimac's last code change was on December 31, 2022, it has no GitHub releases, and its README says "Vimac is now Homerow". The repository isn't archived, but no one is updating it. When we checked in October 2026, vimacapp.com didn't respond.

### Why is Vimac not working on my Mac?

We can't say for certain what's wrong on your Mac. What we do know is that Vimac hasn't been updated since 2022, so problems that show up on newer macOS versions won't get fixes. First check that it still has Accessibility permission in System Settings. If it still doesn't work, it's time to move to a maintained app.

### Is Homerow the same as Vimac?

Homerow is Vimac's successor. Vimac's README calls it "a refined, sleeker, more performant successor of Vimac." Unlike Vimac, Homerow is a paid app ($49.99 once as of October 2026, free to try) and isn't open source.

### Is there a free, open-source Vimac alternative?

Scoot is free and open source (BSD-3-Clause) and was updated in March 2026. It has a label mode for buttons in the focused window, a grid mode and a freestyle pointer mode. Its README only says it runs on macOS 11 and 12, so test it on your version.

### Which Vimac alternative has a scroll mode?

Homerow has a scroll mode. [No Mouse Mode](https://nomousemode.com/) has scroll areas (`⇧⌘J`): each pane gets a number, then J/K scroll, Space pages and T/B jump to the top or bottom. Scoot can scroll too.

### Can I still download Vimac?

The source code is still on GitHub under GPL-3.0, but there are no GitHub releases and we found no Homebrew cask. Because it's unmaintained, we'd suggest one of the maintained options on this page instead.

## Related

- [Homerow alternatives](https://nomousemode.com/homerow-alternatives) — Seven ways to click without a mouse, compared.
- [No Mouse Mode vs Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow) — Price, trial and features of two Mac click-label apps.
- [Vimium for Mac](https://nomousemode.com/vimium-for-mac) — Vimium stops at the browser tab. How to get link hints in every Mac app.
- [No Mouse Mode vs Shortcat](https://nomousemode.com/no-mouse-mode-vs-shortcat) — Search-to-click beta vs labels, pointer, grid and scroll areas.
