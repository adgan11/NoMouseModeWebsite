# Vimium for Mac: link hints for every app, not just the browser

Source: https://nomousemode.com/vimium-for-mac  
Updated: 2026-10-31 · Author: Ahmed Gagan (maker of No Mouse Mode)

Vimium and its cousins only label links inside a web page. **To press `f`-style hints in Finder, Mail, System Settings, the menu bar and the Dock, you need a Mac app that reads buttons through macOS accessibility.** Here's what carries over and how your keys translate.

> **Short answer:** **Vimium can't leave the browser.** It's a browser extension, so its `f` link hints only reach the web page in the current tab. The same goes for Vimium C, Vimari and Vimlike. To get the same "press a key, type the letters, it's clicked" feel in Finder, System Settings, the menu bar, the Dock and every other app, you need a Mac app that reads buttons through macOS accessibility. [No Mouse Mode](https://nomousemode.com/) does that with `⇧⌘Space`, and Homerow, Shortcat and Scoot are worth a look too. Keep Vimium in the browser if you love it; the two get along fine.

## Why Vimium stops at the edge of the browser

[Vimium](https://github.com/philc/vimium) describes itself as "a browser extension that provides keyboard-based navigation and control of the web". That last word is the limit. A browser extension can read and label the links in a web page because the browser hands it the page. It has no view of anything outside that page: not the browser's own toolbar, not Finder, not System Settings, not the menu bar or the Dock.

So when people search for "Vimium for Mac apps" or "Vimium outside the browser", what they actually want is a different kind of tool: a Mac app that asks macOS where every button is. macOS exposes that through its accessibility system, the same information screen readers use. An app with Accessibility permission can put a label on each button in the front window, the menu bar and the Dock, and click it when you type the label.

## The Vimium family on a Mac, at a glance

Checked against each project's own page in October 2026:

| Extension | Browsers | Hint keys | Status | Works outside web pages? |
|---|---|---|---|---|
| Vimium | Chrome, Edge, Firefox | f current tab, F new tab | Active (MIT) | No |
| Vimium C | Chrome/Chromium 102+ (incl. Edge), Firefox 101+ | f / F for links and buttons | Last commit April 2025 | No |
| Vimari | Safari | f / F | Unmaintained since 2021 | No |
| Vimlike | Safari (Mac, iPhone, iPad, Vision Pro) | f labels links, ⇧F background tab | Active, updated October 2026 | No |

All four are free. If you only ever click things inside web pages, one of these is all you need, and there's no reason to pay for anything. The rest of this guide is for when you want the same habit in every other app on your Mac.

## Your Vimium keys, Mac-wide

Here's how the Vimium-family habits translate to [No Mouse Mode](https://nomousemode.com/). We've only listed extension keys that we checked in each project's own docs; other Vimium commands exist, but they live inside the browser and have no Mac-wide twin.

| Vimium habit | Extension key | No Mouse Mode, in any app |
|---|---|---|
| Show link hints, type one to click | f (all four) | ⇧⌘Space anywhere, or F while No Mouse Mode is on |
| Open a link in a new tab | F (Vimium), ⇧F background tab (Vimlike) | Hold ⌘ while typing the last letter (a ⌘-click, so a new tab in browsers) |
| Click several things in a row | Show hints again | Press Tab to keep labels coming back after each click |
| Find something by its text | (in-page search) | Type to click: ⇧⌘/, type part of a button's name ("nf" finds New Folder), Return clicks |
| Scroll down / up | j / k (Vimlike) | Arrow keys while on, or Scroll areas ⇧⌘J, then J / K |
| Jump to top / bottom of a page | (in-page) | In Scroll areas: T / B; Space pages down |
| Right-click a link | none | Hold ⇧ with the last letter |
| Double-click | none | Hold ⌥ with the last letter |
| Click the menu bar or Dock | can't | Labels cover the menu bar and the Dock too |
| Click something with no label | can't | Jump grid (E) or move the pointer with W A S D |

Every key and shortcut in No Mouse Mode can be remapped in Settings. Shortcuts that use ⌘, ⌃ or ⌥ always reach the app you're using, so ⌘C, ⌘W and friends keep working.

## How the Mac-wide version feels

### Click labels: the `f` you already know

Press `⇧⌘Space` and every button, link, tab, menu, checkbox and field in the front window gets a short letter label, along with the menu bar and the Dock. Type the letters and it's clicked. This works whether No Mouse Mode is switched on or off. Labels for a window stay the same each time, so after a few days your fingers learn them, much like Vimium regulars learn their favourite hints.

### Type to click: when you know the word, not the label

Press `⇧⌘/` and type what a button says. Case, spaces and accents are ignored, and initials work. Matches are outlined, `Tab` moves between them and Return clicks. It's the closest thing to searching your way to a link, but for the whole Mac. If this is the half you care about most, also read [No Mouse Mode vs Shortcat](https://nomousemode.com/no-mouse-mode-vs-shortcat), since Shortcat is built around exactly this.

### Scroll areas: `j` and `k` for any pane

A Mac window often has several scrollable panes: a sidebar, a list, a preview. `⇧⌘J` numbers each one. Pick one by number (or `Tab`), then scroll with `J`/`K` or the arrows, page with `Space`, and jump to the top or bottom with `T` and `B`. More on this in [how to move the mouse with the keyboard on a Mac](https://nomousemode.com/move-mouse-with-keyboard-mac).

### The honest catch

Vimium reads the web page itself. A Mac-wide app depends on each app describing its buttons to macOS. Most Mac apps and websites do. Some games, design canvases, remote desktops and older cross-platform apps don't, and they'll show few labels. For those, No Mouse Mode can optionally read the words on screen with Apple's on-device text recognition (it needs Screen Recording permission, and nothing is saved or sent). Buttons that are only icons still need the jump grid or W A S D, which work everywhere.

## Other ways to get Vimium-style hints on the whole Mac

- **[Homerow](https://www.homerow.app)**: "Keyboard shortcuts for every button in macOS". Labels, scroll and search. $49.99 one time as of October 2026, free to try with a reminder every 50 activations, macOS 13 or later. Actively maintained. Compared in [No Mouse Mode vs Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow).
- **[Shortcat](https://shortcat.app)**: "the universal command palette for your Mac". You type what you want to click; after a short pause it also shows letter labels. Free download, still a 0.x beta, last updated July 2025.
- **[Vimac](https://nomousemode.com/vimac-alternative)**: the free, open-source app that became Homerow. Its Hint-mode is the most Vimium-like of the lot, but it hasn't been updated since 2022.
- **[Scoot](https://github.com/mjrusso/scoot)**: free and open source, with element labels on `⇧⌘J`, a grid mode and a freestyle mode. Its README says it runs on macOS 11 and 12 and doesn't state newer versions.
- **Voice Control** (built into macOS): say "Show numbers", then "Click" and the number. It labels everything, but you speak instead of type.

For the full field, see [the best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) and [Homerow alternatives](https://nomousemode.com/homerow-alternatives).

## Set it up in two minutes

1. **Download and open No Mouse Mode.** Get it from [the download page](https://nomousemode.com/download) and drag it into Applications.
2. **Allow Accessibility.** The first-run setup walks you through the one permission it needs and updates by itself when it's on.
3. **Try your new `f`.** Open Finder and press `⇧⌘Space`. Type the letters on a sidebar item.
4. **Try the extras.** `⇧⌘/` to type a button's name, `⇧⌘J` to scroll a pane. The Practice window has nine short lessons if you want a guided tour.

It needs macOS 14 Sonoma or later on Apple silicon or Intel, and costs $19.99 one time for 1 Mac ([pricing](https://nomousemode.com/#pricing)). There's no free trial, but the live demo on this page uses the same keys. Questions go to [support](https://nomousemode.com/support).

**Your Vimium habit, across the whole Mac.** Press ⇧⌘Space in any app, type the letters on a button, and it's clicked: Finder, Settings, the menu bar and the Dock included. Price and checkout: https://nomousemode.com/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).

## FAQ

### Does Vimium work outside the browser on a Mac?

No. Vimium is a browser extension, so it can only see the web page in the current tab. It can't label buttons in Finder, System Settings, the menu bar, the Dock or any other app. The same is true of Vimium C, Vimari and Vimlike. For the rest of the Mac you need a separate app that uses macOS accessibility, such as [No Mouse Mode](https://nomousemode.com/) or [Homerow and its alternatives](https://nomousemode.com/homerow-alternatives).

### Is there a Vimium for Safari?

Vimium itself lists Chrome, Edge and Firefox, not Safari. For Safari there's Vimari (a Vimium port, free on the Mac App Store but not updated since 2021) and Vimlike (free, no in-app purchases, updated October 2026). Both still only work inside web pages.

### Can I keep using Vimium alongside a Mac-wide app?

Yes. Vimium works inside the page and a Mac-wide app works through macOS, so they don't need to replace each other. You can keep `f` for the browser and use `⇧⌘Space` everywhere else. No Mouse Mode's labels also work on web pages that describe their buttons to macOS, which most do, so you can use one tool in both places if you prefer.

### Why are some buttons missing labels in some apps?

Click labels depend on apps describing their buttons to macOS. Most Mac apps do. Some games, design canvases, remote desktops and older cross-platform apps don't. No Mouse Mode can optionally read on-screen text with Apple's on-device text recognition (it needs Screen Recording permission; nothing is saved or sent), and the jump grid and W A S D movement work in every app.

### Is there a free Vimium-style app for the whole Mac?

Yes, a few. [Scoot](https://github.com/mjrusso/scoot) is free and open source, with element labels on `⇧⌘J`, but its README only states macOS 11 and 12. [Vimac](https://nomousemode.com/vimac-alternative) is free but hasn't been updated since 2022. Shortcat is a free download, still in beta. macOS's built-in Voice Control can also number every item, though you say the number rather than type it.

### What does No Mouse Mode cost and what Mac do I need?

$19.99 one time for 1 Mac, with free updates and no subscription (as of October 2026). There's no free trial, but the website has interactive demos that use the same keys. It needs macOS 14 Sonoma or later and runs on Apple silicon and Intel. See [pricing](https://nomousemode.com/#pricing).

## Related

- [Homerow alternatives](https://nomousemode.com/homerow-alternatives) — Seven ways to click without a mouse, compared.
- [Vimac alternatives](https://nomousemode.com/vimac-alternative) — Vimac is now Homerow. What replaces it today.
- [No Mouse Mode vs Shortcat](https://nomousemode.com/no-mouse-mode-vs-shortcat) — Search-to-click beta vs labels, pointer, grid and scroll areas.
- [How to use a Mac without a mouse](https://nomousemode.com/how-to-use-mac-without-mouse) — Every built-in method and app, compared, with a 5-minute setup.
