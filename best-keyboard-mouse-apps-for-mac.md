# The best keyboard mouse apps for Mac in 2026

Source: https://nomousemode.com/best-keyboard-mouse-apps-for-mac  
Updated: 2026-10-31 · Author: Ahmed Gagan (maker of No Mouse Mode)

There's no single best mouseless app, because they do different jobs. **Label apps click buttons, search apps click by name, grid and pointer apps reach anywhere, and macOS has free built-ins that are enough for many people.** Here's what each one is for.

> **Short answer:** For one app that clicks by label or by name *and* moves the pointer, drags, scrolls panes and has a grid, we'd pick [No Mouse Mode](https://nomousemode.com/) (we make it, so weigh that). For label clicking alone, Homerow is the polished, maintained choice. For free, Scoot is open source and maintained, and Shortcat is a free-download beta. Mouseless suits people who also use Windows or Linux. If you only need a mouse now and then, the free macOS built-ins (Mouse Keys, Voice Control, Full Keyboard Access) may be all you need.

## How we picked (and our bias)

This guide is written by the maker of [No Mouse Mode](https://nomousemode.com/), so it isn't neutral. To keep it useful anyway, every price, version and date below was checked on the app's official site, docs, changelog, GitHub repository or Homebrew listing on October 31, 2026. Where something wasn't published (a price, a minimum macOS), we say so instead of guessing. We sorted by use case rather than crowning one winner, because a label app and a grid app solve different problems.

The four approaches you'll see:

- **Labels:** letters appear on every button; type one to click it.
- **Search to click:** type a button's name; the app finds and clicks it.
- **Grid:** the screen splits into cells you pick by key, to reach any spot.
- **Free pointer:** keys move the cursor like a mouse would.

Labels and search depend on apps describing their buttons to macOS through accessibility. Most Mac apps and websites do, but some (games, design canvases, remote desktops) don't. Grids and free pointers work everywhere.

## The whole field at a glance

| App | Price (as of Oct 2026) | Approach | Moves pointer | Grid | Maintained | macOS |
|---|---|---|---|---|---|---|
| No Mouse Mode | $19.99 one time (1 Mac); no trial | Labels, type to click, scroll areas | Yes, W A S D | Yes, 3×3 zooming | Yes, 2.0.1 | 14+ |
| Homerow | $49.99 one time; free to try with a reminder every 50 activations | Labels, scroll, search | Not shown on its site | Not shown on its site | Yes, 1.5.3 (Mar 2026) | 13+ |
| Shortcat | Free download; no price on its site | Search to click, labels | Not listed | Not listed | Last update Jul 2025 (v0.12.2 beta) | 13+ |
| Wooshy | Free with "naps", or $3.88/mo / $46.28/yr | Search to click (incl. Dock, menu bar) | No mode documented | Not documented | Yes | 14.6+ (older builds for Ventura, Monterey) |
| Scoot | Free, open source (BSD-3) | Labels, grid, freestyle | Yes | Yes | Yes, v1.3 (Mar 2026) | README: 11 and 12 |
| Mouseless | Not published (lifetime or subscription); 14-day trial | Grid, free mode, labels (beta) | Yes | Yes | Yes, v1.1.0 (Oct 2026) | 12+ (Homebrew) |
| warpd | Free, open source (MIT) | Hints, grid, normal mode | Yes | Yes | No, last commit Jun 2023 | Unknown |
| Vimac | Free, open source (GPL-3.0) | Hints, scroll mode | Not listed | Not listed | No, last commit Dec 2022; now Homerow | Unknown |
| Mouse Keys | Free, built in | Number keys move the pointer | Yes | No | Part of macOS | Built in |
| Voice Control | Free, built in | Spoken numbers, names and grid | By voice | Yes, by voice | Part of macOS | Built in |
| Full Keyboard Access | Free, built in | Tab focus between controls | No | No | Part of macOS | Built in |
| Vimium | Free, open source (MIT) | Link hints in the browser only | No | No | Yes | Chrome, Edge, Firefox |

"Not shown" or "not listed" means we didn't find the feature on the app's own site or docs. It doesn't prove the app lacks it.

## 1. No Mouse Mode: best all-in-one keyboard mouse

[No Mouse Mode](https://nomousemode.com/) 2.0 tries to replace the whole mouse, not just the click. **Click labels** (`⇧⌘Space`) put letters on every button, link, tab and menu in the front window, plus the menu bar and the Dock. **Type to click** (`⇧⌘/`) finds a button by part of its name or its initials. **Scroll areas** (`⇧⌘J`) number each scrollable pane. Press `⇧⌘M` and your keys become the mouse: `W` `A` `S` `D` glide the cursor (Shift for fast, Q for one-pixel precise), `Space` clicks or drags, `Return` right-clicks, `M` middle-clicks, and `E` opens a 3×3 grid that reaches anywhere in two or three presses.

For apps that don't describe their buttons to macOS, it can optionally read on-screen text with Apple's on-device text recognition (needs Screen Recording; nothing is saved or sent). A Practice window with nine lessons teaches the keys. The trade-offs: there's no free trial (the site has in-browser demos instead), it's $19.99 one time for 1 Mac ($49.99 for 3), and it needs macOS 14 Sonoma or later on Apple silicon or Intel. Its default label shortcut is the same `⇧⌘Space` that Shortcat uses and Homerow's demos show, but every shortcut can be changed.

## 2. Homerow: best for polished label clicking

[Homerow](https://www.homerow.app) offers "keyboard shortcuts for every button in macOS": labels on buttons, links and UI elements, plus scrolling and search. It's the successor of Vimac and is actively maintained (1.5.3, March 2026). It's $49.99 one time and covers all your personal Macs, and it's free to try with a reminder every 50 activations. It needs macOS 13 or later. Its site doesn't show a free-pointer or grid mode. Compared in detail: [No Mouse Mode vs Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow) and [Homerow alternatives](https://nomousemode.com/homerow-alternatives).

## 3. Shortcat: best free search-to-click

[Shortcat](https://shortcat.app) is "the universal command palette for your Mac". Press `⇧⌘Space`, type what you want to click, and it clicks it. After a short delay it also shows letter labels. It handles right, double and modifier clicks, window search, menu search and emoji. It's a free download (the site lists no price), needs macOS 13 or later, and is still a 0.x beta last updated in July 2025. See [No Mouse Mode vs Shortcat](https://nomousemode.com/no-mouse-mode-vs-shortcat).

## 4. Wooshy: best for searching the whole screen

[Wooshy](https://wooshy.app) searches the whole macOS interface, including the Dock, the menu bar and the status bar, and clicks what you type. It's a free download that is "full-featured, but takes some random naps"; a subscription of $3.88 a month or $46.28 a year keeps it running all the time. There's no one-time option listed. It needs macOS 14.6 Sonoma, with older builds offered for Ventura and Monterey. It doesn't document a pointer-movement mode.

## 5. Scoot: best free and open source

[Scoot](https://github.com/mjrusso/scoot) is a "keyboard-driven MacOS cursor actuator" with three modes: element labels (`⇧⌘J`), a grid across all screens (`⇧⌘K`) and freestyle movement using familiar text-editing shortcuts (`⇧⌘L`). It's free, BSD-3-Clause, and maintained (v1.3, March 2026). Its README says it runs on macOS 11 and 12 and doesn't mention newer versions, so check it on yours. Note that its `⇧⌘J` default is the same as No Mouse Mode's scroll areas shortcut.

## 6. Mouseless: best if you also use Windows or Linux

[Mouseless](https://mouseless.click) promises "lightning-fast mouse control with the keyboard" on macOS, Windows and Linux. Tap Left Command for a grid and type a cell's two characters; tap Left Option for a free mode where I/J/K/L move the pointer. Label mode is in beta. It's closed source and actively maintained (v1.1.0, October 2026). Pricing is "lifetime or subscription", but the amounts aren't published on its site; there's a 14-day trial with no card or email, and each license works on 5 machines.

## 7. warpd: free, but not updated since 2023

[warpd](https://github.com/rvaiya/warpd) is "a modal keyboard-driven virtual pointer" with hint, grid and normal (hjkl) modes. It's free (MIT), has about 3,660 GitHub stars and also runs on Linux, but its last commit was in June 2023 and the last macOS release was in November 2022. Installing it on a Mac means a prebuilt tarball or a source build. See [warpd for Mac](https://nomousemode.com/warpd-for-mac).

## 8. Vimac: don't start here today

[Vimac](https://github.com/nchudleigh/vimac), the free open-source app that became Homerow, hasn't been updated since 2022. Its README now says "Vimac is now Homerow". If you liked its hint mode, read [Vimac alternatives](https://nomousemode.com/vimac-alternative).

## 9. The free macOS built-ins

Before you buy anything, know what your Mac already has:

- **Mouse Keys** (System Settings > Accessibility > Pointer Control) moves the pointer with 7 8 9 U O J K L or the keypad, and clicks with I or keypad 5. It works with no mouse or trackpad at all, which makes it a lifesaver when one breaks. The catch: while it's on you can't type text. More in [No Mouse Mode vs Mouse Keys](https://nomousemode.com/no-mouse-mode-vs-mouse-keys).
- **Voice Control** (System Settings > Accessibility > Voice Control) lets you say "Show numbers" and "Click" plus a number, or "Show grid" to reach any spot. It's the closest built-in to labels, but you use your voice, not keys.
- **Full Keyboard Access** (System Settings > Accessibility > Motor > Keyboard) highlights the focused control and moves through them with Tab. It works everywhere, but reaching a far-away button can take many presses. See [Full Keyboard Access on Mac](https://nomousemode.com/full-keyboard-access-mac).

## 10. Vimium: great, but only in the browser

[Vimium](https://github.com/philc/vimium) is a free, actively maintained browser extension for Chrome, Edge and Firefox. Press `f` and every link in the page gets a hint. If you spend your day in a browser, install it. It can't reach Finder, System Settings, the menu bar, the Dock or other apps, which is where Mac-wide tools come in. More in [Vimium for Mac](https://nomousemode.com/vimium-for-mac).

## Which one should you choose?

- **Your mouse or trackpad just died:** turn on Mouse Keys now; see [Mac trackpad not working](https://nomousemode.com/mac-trackpad-not-working).
- **You want to click buttons faster and still use a trackpad sometimes:** Homerow, Shortcat or No Mouse Mode's labels.
- **You want to drop the mouse entirely**, for comfort or [RSI](https://nomousemode.com/keyboard-only-mac-rsi): an app that also moves the pointer, drags and scrolls, such as No Mouse Mode, Scoot or Mouseless.
- **You want free and open source:** Scoot.
- **You switch between Mac, Windows and Linux:** Mouseless.
- **You only live in a browser:** Vimium.

New to all this? Start with the hub guide, [how to use a Mac without a mouse](https://nomousemode.com/how-to-use-mac-without-mouse).

**Labels, type to click, a pointer and a grid in one app** No Mouse Mode turns your keyboard into a full mouse for $19.99 one time, with free updates. Price and checkout: https://nomousemode.com/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).

## FAQ

### What is the best Vimium-like app for Mac?

Vimium itself only works inside web pages in Chrome, Edge and Firefox. For Vimium-style letter hints in every Mac app, look at [No Mouse Mode](https://nomousemode.com/), Homerow or Scoot. Vimac was the original free option, but it hasn't been updated since 2022 and its README says it is now Homerow. More in [Vimium for Mac](https://nomousemode.com/vimium-for-mac).

### Is there a free keyboard mouse app for Mac?

Yes. Scoot is free and open source (BSD-3-Clause) with labels, a grid and a free-moving mode. Shortcat is a free download with no price on its site. warpd is free but not updated since 2023. macOS also has Mouse Keys, Full Keyboard Access and Voice Control built in at no cost.

### Does macOS have a built-in way to use the mouse with the keyboard?

Yes, Mouse Keys. Turn it on in System Settings > Accessibility > Pointer Control > Mouse Keys, then move with 7 8 9 U O J K L (or the keypad) and click with I or keypad 5. While it's on you can't type text. See [No Mouse Mode vs Mouse Keys](https://nomousemode.com/no-mouse-mode-vs-mouse-keys).

### Which mouseless Mac apps have a grid?

No Mouse Mode (a 3×3 grid that zooms in with each press), Scoot, Mouseless and warpd all have a grid mode. Voice Control has one too, but you use it by voice ("Show grid").

### Is Vimac still maintained?

No. Vimac's last commit was on December 31, 2022, and its README says "Vimac is now Homerow". It still exists as free, open-source code, but if you're starting today, look at a maintained app. See [Vimac alternatives](https://nomousemode.com/vimac-alternative).

### Which keyboard mouse app works on Mac, Windows and Linux?

Mouseless runs on macOS, Windows and Linux, and each license can be activated on 5 machines. warpd also runs on Linux (X11 and some Wayland setups) and macOS, but it hasn't been updated since 2023.

### Are you biased?

Yes. This guide is written by the maker of No Mouse Mode. We stick to facts we checked on each app's official site, docs or repository in October 2026, and we say where a free or built-in option is enough.

## Related

- [How to use a Mac without a mouse](https://nomousemode.com/how-to-use-mac-without-mouse) — Every built-in method and app, compared, with a 5-minute setup.
- [Homerow alternatives](https://nomousemode.com/homerow-alternatives) — Seven ways to click without a mouse, compared.
- [No Mouse Mode vs Shortcat](https://nomousemode.com/no-mouse-mode-vs-shortcat) — Search-to-click beta vs labels, pointer, grid and scroll areas.
- [Vimium for Mac](https://nomousemode.com/vimium-for-mac) — Vimium stops at the browser tab. How to get link hints in every Mac app.
