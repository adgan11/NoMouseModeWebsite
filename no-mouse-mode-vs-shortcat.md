# Shortcat vs No Mouse Mode: search to click, or the whole mouse

Source: https://nomousemode.com/no-mouse-mode-vs-shortcat  
Updated: 2026-10-31 · Author: Ahmed Gagan (maker of No Mouse Mode)

Shortcat is a command palette for clicking: type what you want and it clicks it. **If clicking named buttons is all you need, Shortcat may be enough. If you also want to move the pointer, drag, scroll panes and reach things with no name, No Mouse Mode covers that.**

> **Short answer:** Shortcat is a free-download command palette for clicking: press `⇧⌘Space`, type the name of a button, and it clicks it. It's a 0.x beta, last updated in July 2025. [No Mouse Mode](https://nomousemode.com/) ($19.99 one time, as of October 2026) also clicks by typing, either with letter labels or by name, and adds the rest of the mouse: smooth pointer movement, drag, middle and back/forward clicks, a jump grid and scroll areas. If you only click named buttons, try Shortcat first. If you want to leave the mouse in the drawer, No Mouse Mode covers more.

## Two ways to click without a mouse

Both apps start from the same idea: macOS knows where the buttons are, so you shouldn't have to aim a pointer at them. They differ in how much of the mouse they replace.

- **Shortcat is search to click.** You open its palette, type what you want ("ok" finds an OK button), and it clicks it. After 2 seconds (configurable) it also shows black-on-yellow labels with 1 to 3 letter shortcuts.
- **No Mouse Mode is a keyboard mouse.** It has two ways to click by typing (labels and type to click), plus a mode where your keys *are* the mouse: `W` `A` `S` `D` move the pointer, `Space` clicks, `Return` right-clicks and the arrow keys scroll.

So the question is whether you need to click things, or do everything a mouse does.

## What Shortcat does well

[Shortcat](https://shortcat.app) describes itself as "the universal command palette for your Mac". From its site and docs (as of October 2026):

- **Type what you see.** It indexes the interface and you search by name. That's natural if you already live in a launcher or command palette.
- **More than a left click.** Right-click, double-click and clicks with modifier keys.
- **Extras:** window search, menu search and an emoji mode.
- **Broad app support:** Safari, Chrome, Firefox, some Chromium browsers and most Electron apps. Its own docs add that "effectiveness may vary depending on application's Accessibility implementation."
- **Easy to get:** a free download, or `brew install shortcat`. The official site states no price. It needs macOS 13 or later and runs on Apple silicon and Intel.

### What to know before you rely on it

Shortcat is still a 0.x beta. The latest version is v0.12.2, from July 3, 2025, and the one before it, v0.12.1, moved the beta expiry date out to 2030. There have been long gaps before: before April 2025, the previous release was in January 2023. That doesn't mean it has stopped working, and plenty of people use it happily. It just means you can't count on regular updates the way you might with a paid, actively released app.

## What No Mouse Mode adds

[No Mouse Mode](https://nomousemode.com/) 2.0 is a menu bar app that turns the keyboard into a mouse. The clicking side will feel familiar to Shortcat users:

- **Click labels** (`⇧⌘Space`): every button, link, tab and menu in the front window, plus the menu bar and the Dock, gets letter labels. Type one to click it. Hold `Shift` with the last letter to right-click, `Command` to Command-click, `Option` to double-click or `Control` to just move the pointer there. `Tab` keeps labels open for several clicks, and a window's labels stay the same each time, so they become muscle memory.
- **Type to click** (`⇧⌘/`): type part of a button's or text's name. Case, spaces and accents don't matter, and initials work ("nf" finds New Folder). `Return` clicks. This is the closest match to Shortcat's search.

Then it covers what search-to-click doesn't:

- **A real pointer.** Press `⇧⌘M` and `W` `A` `S` `D` glide the cursor with eased movement. Hold `Shift` for speed or `Q` for one-pixel precision. That matters for things that aren't buttons: a spot on a canvas, a slider, the edge of a window.
- **Every mouse button.** Click, double, triple, drag (hold `Space`), right, middle, and back/forward with `[` and `]`.
- **Jump grid** (`E`): a 3×3 grid labelled Q W E / A S D / Z X C that zooms in with each press. Two or three presses reach anywhere, in any app, whether or not it describes its buttons to macOS.
- **Scroll areas** (`⇧⌘J`): each scrollable pane gets a number. Pick one, then scroll with the arrows or `J`/`K`, page with `Space`, or jump to the top or bottom with `T`/`B`.
- **Saved spots and display jumps.** Save up to nine cursor positions, jump back with ```, and move between displays with `Tab`.
- **A way in for awkward apps.** Some apps don't tell macOS where their buttons are, so labels (in any app that relies on that, Shortcat included) find little. No Mouse Mode can optionally read on-screen text with Apple's on-device text recognition to label those apps too. It needs Screen Recording permission, and nothing is saved or sent. Buttons that are only icons still need the grid or W A S D.

It's easy to learn: setup is guided, a Practice window has nine hands-on lessons, and `H` shows every key. Every key and shortcut can be remapped.

## Shortcat vs No Mouse Mode at a glance

|  | Shortcat | No Mouse Mode |
|---|---|---|
| Approach | Command palette: search to click, labels after a delay | Click labels, type to click, plus a keyboard-driven pointer |
| Default shortcut | ⇧⌘Space | ⇧⌘Space labels, ⇧⌘/ type to click, ⇧⌘J scroll areas, ⇧⌘M on/off |
| Right, double, modifier clicks | Yes | Yes, plus triple, middle, back/forward |
| Move the pointer freely | Not among its listed features | Yes, W A S D with fast and precise modes |
| Drag | Not among its listed features | Yes, hold Space |
| Grid for any spot on screen | Not among its listed features | Yes, 3×3 zooming grid |
| Scroll a chosen pane | Not among its listed features | Yes, numbered scroll areas |
| Window and menu search, emoji | Yes | No (labels cover the menu bar and Dock) |
| Apps without accessibility info | "Effectiveness may vary" | Optional on-device text recognition; grid and W A S D work everywhere |
| macOS | 13+, Apple silicon and Intel | 14 Sonoma or later, Apple silicon and Intel |
| Latest release | v0.12.2 beta, July 2025 | 2.0.1 |
| Price (as of October 2026) | Free download; no price on its site | $19.99 one time for 1 Mac; no free trial |

## Who should pick which

### Pick Shortcat if…

- you mostly click buttons and links that have a name, and still reach for the trackpad now and then;
- you like a search box more than labels;
- you want window search and menu search in the same tool;
- you'd rather not pay, and you're fine with a beta that was last updated in July 2025.

### Pick No Mouse Mode if…

- you want to stop using the mouse or trackpad, not just use it less, for comfort, a [broken trackpad](https://nomousemode.com/mac-trackpad-not-working) or [RSI](https://nomousemode.com/keyboard-only-mac-rsi);
- you need to drag, select text, hit unlabeled spots or [move the pointer with the keyboard](https://nomousemode.com/move-mouse-with-keyboard-mac);
- you scroll a lot in multi-pane apps like mail, chat or code editors;
- you want one app with a guided setup and a practice window, and a current, maintained release.

If you're still weighing up label apps, [No Mouse Mode vs Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow) and [Homerow alternatives](https://nomousemode.com/homerow-alternatives) cover Shortcat's closest neighbour.

## Can you run Shortcat and No Mouse Mode together?

Yes. Some people keep Shortcat for its menu and window search and use No Mouse Mode for the pointer, grid and scrolling. The one thing to sort out is the shortcut, because **both default to `⇧⌘Space`**. (Homerow's site demos show the same combination, so this isn't unusual.) In No Mouse Mode:

1. Click the No Mouse Mode icon in the menu bar and choose **Settings…**.
2. Open the **General** tab and find **Anywhere shortcuts**.
3. Click the **Click labels** field and press the new shortcut you want.

You can also skip the global shortcut: while No Mouse Mode is on, plain `F` opens click labels and `/` opens type to click. Shortcuts that use Command, Control or Option always reach the app in front, so they keep working while No Mouse Mode is on.

## The bottom line

Shortcat is a clever, free-download way to click by name, and if that's the only mouse job you want to replace, it's worth a try. No Mouse Mode is for people who want the whole mouse on the keyboard: clicking by label or name, a smooth pointer, drag, a grid for anywhere on screen and pane-by-pane scrolling. The demo on this page uses the same keys as the app, so you can feel the difference before you [buy](https://nomousemode.com/#pricing). For the full field, see the [best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac).

**Click by typing, then keep going without a mouse** No Mouse Mode gives you click labels, type to click, smooth W A S D movement, a jump grid and scroll areas in one menu bar app. Price and checkout: https://nomousemode.com/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).

## FAQ

### What is Shortcat for Mac?

Shortcat calls itself "the universal command palette for your Mac". It indexes the buttons and other elements on screen, and you type what you want to click, such as "ok" for an OK button. It also does right-clicks, double-clicks, clicks with modifier keys, window search, menu search and an emoji mode. Its default shortcut is `⇧⌘Space`.

### Is Shortcat free?

Shortcat is a free download from its site or with `brew install shortcat`, and its official site lists no price as of October 2026. It is still a 0.x beta; version 0.12.1 moved its beta expiry date to 2030.

### Is Shortcat still maintained?

Its latest release is v0.12.2 from July 3, 2025, so as of October 2026 it was last updated in July 2025. Before the 2025 releases, the previous one was v0.11.4 in January 2023. It still runs on macOS 13 and later; its docs say it was tested on macOS 15.3.

### Shortcat vs Homerow: which is better?

They overlap a lot: both put keyboard labels on buttons and both let you search. Homerow is $49.99 one time (as of October 2026), is free to try with a reminder every 50 activations, needs macOS 13 or later and had releases in March 2026. Shortcat is a free-download beta last updated July 2025. See [No Mouse Mode vs Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow) for how Homerow compares with us.

### Can I use Shortcat and No Mouse Mode together?

Yes, but both use `⇧⌘Space` by default, so change one. In No Mouse Mode, open the menu bar icon, choose Settings…, go to General and record a new Click labels shortcut under Anywhere shortcuts. You can also press `F` for labels while No Mouse Mode is on.

### Does No Mouse Mode have a free trial?

No. No Mouse Mode is $19.99 one time for 1 Mac, with free updates. Instead of a trial, the [website](https://nomousemode.com/) has interactive in-browser demos that use the same keys as the app.

## Related

- [No Mouse Mode vs Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow) — Price, trial and features of two Mac click-label apps.
- [Homerow alternatives](https://nomousemode.com/homerow-alternatives) — Seven ways to click without a mouse, compared.
- [Best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) — Twelve mouseless tools ranked by use case, with prices and status.
- [How to use a Mac without a mouse](https://nomousemode.com/how-to-use-mac-without-mouse) — Every built-in method and app, compared, with a 5-minute setup.
