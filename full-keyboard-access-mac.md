# Full Keyboard Access on Mac: how to turn it on, the keys, and its limits

Source: https://nomousemode.com/full-keyboard-access-mac  
Updated: 2026-10-31 · Author: Ahmed Gagan (maker of No Mouse Mode)

Your Mac can already be driven from the keyboard. **Turn on Full Keyboard Access, then press Tab to move between controls and Space to press one.** Here's how to set it up, every key Apple documents for it, and where a label-based app gets you there faster.

> **Short answer:** Open **System Settings → Accessibility → Motor → Keyboard** and switch on **Full Keyboard Access**. Then `Tab` moves a highlight to the next item, `Space` selects it, and `Tab`-`H` shows the full list of commands. If you only want Tab to stop on buttons too, press `Control-F7`. It's free and good for settings screens and dialogs. Where it struggles is busy windows: you press Tab over and over to reach one button. A label-based app such as [No Mouse Mode](https://nomousemode.com/) lets you jump straight to it instead.

## Two built-in settings with similar names

Apple has two separate features here, and they're easy to mix up.

|  | Keyboard navigation | Full Keyboard Access | No Mouse Mode |
|---|---|---|---|
| What it does | Lets Tab stop on every control, not just text boxes and lists | Highlights the focused item and lets you drive the Mac with the keyboard | Moves and clicks the real pointer; labels every clickable thing |
| Where to turn it on | System Settings → Keyboard (Sonoma 14 guide), or Control-F7 | System Settings → Accessibility → Motor → Keyboard | Install the app; it asks for Accessibility permission |
| How you reach a button | Tab, Tab, Tab… | Tab, arrows, Control-Tab | Type its label letters, or part of its name |
| Menu bar and Dock | Control-F2 / Control-F3 | Control-F2 / Control-F3 | Labelled along with the window |
| Price | Free, built in | Free, built in | $19.99 one-time for 1 Mac (as of October 2026), no trial |

If you came here to "tab through buttons", Keyboard navigation (or `Control-F7`) may be all you need. If you want to use the Mac without touching the trackpad at all, Full Keyboard Access is the fuller option.

## How to turn on Full Keyboard Access

1. Open **System Settings** (Apple menu → System Settings).
2. Choose **Accessibility** in the sidebar.
3. Under **Motor**, choose **Keyboard**.
4. Switch on **Full Keyboard Access**.

That's the path in Apple's current Mac User Guide ([Use Full Keyboard Access](https://support.apple.com/guide/mac-help/use-full-keyboard-access-mchlc06d1059/mac)). On the same screen you can change how the highlight looks: its color, contrast and size. A bigger, higher-contrast highlight makes it much easier to see where you are.

No pointer at all right now? Our [trackpad not working](https://nomousemode.com/mac-trackpad-not-working) guide shows how to get into System Settings using only the keyboard.

## How to turn on Keyboard navigation (Tab to every button)

Without this, Tab in most windows only jumps between text boxes and lists, and skips buttons and checkboxes. Two ways to change it:

- **The shortcut:** press `Control-F7` (or `Fn-Control-F7` if your top row controls brightness and volume). It switches Tab between all controls and only text boxes and lists.
- **The setting:** in Apple's macOS 14 Sonoma guide, it's System Settings → Keyboard → **Keyboard navigation**. Apple's newer guides no longer have a page for this switch, so if you can't find it, use the shortcut.

With it on, `Tab` goes to the next control and `Shift-Tab` to the previous one.

## The keys, according to Apple

### Full Keyboard Access

| Press | To |
|---|---|
| Tab / Shift-Tab | Move to the next / previous element |
| Space | Select the focused item |
| Arrow keys | Move within a group |
| Control-Tab / Control-Shift-Tab | Next / previous item |
| Tab-H | Open Commands Help (every command in one list) |
| Control-Option-Command-P | Turn Pass-Through Mode on or off |

### Focus shortcuts (work alongside either setting)

From Apple's [Mac keyboard shortcuts](https://support.apple.com/en-us/102650) page. Add `Fn` if your function keys control the hardware. Some of these have to be switched on first in System Settings → Keyboard → Keyboard Shortcuts → Keyboard.

| Press | Moves focus to |
|---|---|
| Control-F2 | The menu bar. Then arrows to move, Return to open or choose, or type an item's name |
| Control-F3 | The Dock |
| Control-F4 | The active window, or the next one |
| Control-F5 | The window's toolbar |
| Control-F7 | Switches Tab between all controls and only text boxes and lists |
| Control-F8 | The status menus in the menu bar |

## Where Full Keyboard Access is great

- **Dialogs and settings.** A save sheet or a settings pane has a handful of controls. Tab, Tab, Space, done.
- **Forms.** Tab order on a form usually follows the fields from top to bottom, which is exactly what you want.
- **When there's no pointer at all.** It needs no mouse or trackpad, which makes it a solid fallback when yours stops working.
- **Accessibility needs.** The adjustable highlight and the built-in help make it a dependable everyday tool, and it costs nothing.

## Its limits

### You reach things in Tab order, not where your eyes are

Focus moves through a window in the order the app defines. You see the button you want in the top-right corner, but Tab may visit a sidebar, a toolbar and a list before it gets there. In a busy window, that's a lot of presses for one click, and you have to watch the highlight the whole time.

### It moves focus, not the pointer

Full Keyboard Access selects the focused item. It doesn't put the mouse pointer anywhere. So things that depend on the pointer, such as hovering to reveal a hidden button, dragging, or clicking a spot on a canvas, aren't what it's built for. For those, see [how to move the mouse with the keyboard](https://nomousemode.com/move-mouse-with-keyboard-mac), including Apple's own Mouse Keys.

### Apps vary

How well Tab works depends on how each app is built. Some apps have a tidy order. Others skip controls or trap focus in one area. That's true of every keyboard tool that relies on what apps tell macOS, ours included.

## When a label-based app is faster

Instead of walking through controls one by one, a label-based tool shows everything you can click at once. In [No Mouse Mode](https://nomousemode.com/), press `⇧⌘Space` and every button, link, tab and menu in the front window, plus the menu bar and the Dock, gets a short letter label. Type the label and it's clicked. Other apps use the same idea (see [No Mouse Mode vs Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow) and [No Mouse Mode vs Shortcat](https://nomousemode.com/no-mouse-mode-vs-shortcat); Homerow and Shortcat also show ⌘⇧Space in their docs and demos).

A few things No Mouse Mode adds on top of labels:

- **Type to click** (`⇧⌘/`): type part of a button's name, such as "nf" for New Folder, and press Return.
- **Different clicks from a label:** hold Shift for a right-click, Command for a Command-click (a new tab in browsers), Option for a double-click.
- **A real pointer when you need one:** `⇧⌘M` turns on `W` `A` `S` `D` movement, `Space` to click and hold to drag, and a jump grid (`E`) that reaches anywhere in two or three presses, in any app.

The honest trade-off: labels, like Tab, depend on apps describing their buttons to macOS, which most do. For apps that don't, there's an optional setting that reads on-screen text with Apple's on-device text recognition (it needs Screen Recording permission, and nothing is saved or sent), and the grid and W A S D work everywhere. No Mouse Mode costs $19.99 one-time for 1 Mac (as of October 2026) and there's no free trial, but you can try the same keys in the demo on this page. It runs on macOS 14 Sonoma or later, on Apple silicon and Intel.

## Which should you use?

- **Keyboard navigation (`Control-F7`)** if you mostly type and just want Tab to reach buttons in dialogs.
- **Full Keyboard Access** if you want a free, complete way to run the Mac from the keyboard and don't mind stepping through controls.
- **A label-based app** if you find yourself pressing Tab ten times to reach one button, or you want to click anywhere you can see. Our [guide to using a Mac without a mouse](https://nomousemode.com/how-to-use-mac-without-mouse) puts all the options side by side, and [the best keyboard mouse apps](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) compares the apps.

**Skip the Tab, Tab, Tab** No Mouse Mode puts a short letter label on every button, link and menu, so any of them is one or two keystrokes away. Price and checkout: https://nomousemode.com/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).

## FAQ

### How do I turn on Full Keyboard Access on a Mac?

Open System Settings, go to Accessibility, then Motor, then Keyboard, and switch on Full Keyboard Access. That's the path in Apple's current Mac User Guide. Once it's on, the focused item gets a highlight and Tab moves it.

### What is the difference between Full Keyboard Access and Keyboard navigation?

Keyboard navigation is the simpler setting: when it's on, Tab moves to every control (buttons, checkboxes, pop-up menus), not just text boxes and lists. On macOS 14 Sonoma it's a switch in System Settings → Keyboard, and Control-F7 toggles it. Full Keyboard Access is the bigger accessibility feature: it highlights the focused item, lets you customize that highlight, and adds more keys such as Control-Tab and Tab-H for its Commands Help.

### How do I tab through buttons on a Mac?

Press Control-F7 (or Fn-Control-F7) to switch Tab between all controls and only text boxes and lists. With all controls on, Tab goes to the next button and Shift-Tab to the previous one. Space presses the focused button when Full Keyboard Access is on.

### How do I get to the menu bar or Dock without a mouse?

Control-F2 (or Fn-Control-F2) puts focus on the menu bar; use the arrow keys to move, Return to open or choose, or type an item's name. Control-F3 focuses the Dock. Some of these shortcuts must first be turned on in System Settings → Keyboard → Keyboard Shortcuts → Keyboard.

### Why does Control-F7 or Control-F2 do nothing?

On many Mac keyboards the top row controls brightness, volume and so on by default, so add Fn: Fn-Control-F7 or Fn-Control-F2. Apple also says some focus shortcuts have to be enabled first in System Settings → Keyboard → Keyboard Shortcuts → Keyboard.

### Is Full Keyboard Access free?

Yes, it's built into macOS. So are Mouse Keys and Voice Control. If Tab is enough for what you do, you don't need anything else. [No Mouse Mode](https://nomousemode.com/) is a paid app ($19.99 one-time for 1 Mac, as of October 2026, with no free trial) for people who want to click things directly by label.

### Can I use Full Keyboard Access and No Mouse Mode together?

We haven't documented testing them side by side, so we can't promise how they interact. They do different jobs: Full Keyboard Access moves a focus highlight, while No Mouse Mode moves and clicks the real pointer. No Mouse Mode passes any shortcut that uses Command, Control or Option to the focused app.

## Related

- [How to use a Mac without a mouse](https://nomousemode.com/how-to-use-mac-without-mouse) — Every built-in method and app, compared, with a 5-minute setup.
- [No Mouse Mode vs Mouse Keys](https://nomousemode.com/no-mouse-mode-vs-mouse-keys) — How to use Mac Mouse Keys, its limits, and an alternative.
- [Trackpad not working?](https://nomousemode.com/mac-trackpad-not-working) — Keyboard-only first aid, and how to keep working until it's fixed.
- [Best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) — Twelve mouseless tools ranked by use case, with prices and status.
