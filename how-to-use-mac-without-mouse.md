# How to use a Mac without a mouse or trackpad

Source: https://nomousemode.com/how-to-use-mac-without-mouse  
Updated: 2026-10-31 · Author: Ahmed Gagan (maker of No Mouse Mode)

You can run a Mac from the keyboard alone. **macOS has Full Keyboard Access, Mouse Keys and Voice Control built in, and an app like No Mouse Mode lets you click any button by typing its label.** Here's every method, what it's good at, and how to set one up in five minutes.

> **Short answer:** Start with what's built in: **Full Keyboard Access** (Tab between controls, Space to press) plus **Control-F2** for the menu bar and **Control-F3** for the Dock. That covers a lot of everyday work. Where it falls short is anything that needs a pointer: a web page, a canvas, a right-click, a drag. **Mouse Keys** fills that gap for free but blocks typing while it's on. If you want to click any button in a couple of keystrokes and steer the pointer smoothly, an app like [No Mouse Mode](https://nomousemode.com/) does both.

## Why go mouse-free?

People land here for different reasons. The trackpad or mouse just died and you need to get through the day. Your wrist hurts after long sessions. Or you already live on the keyboard in a code editor and reaching for the trackpad breaks your flow. The good news: macOS was built with keyboard users in mind, and the gaps it leaves are easy to fill.

If your trackpad has stopped working right now, jump to [what to do when your Mac trackpad isn't working](https://nomousemode.com/mac-trackpad-not-working). If it's about comfort, see [using a Mac keyboard-only for wrist pain](https://nomousemode.com/keyboard-only-mac-rsi).

## Built in: Full Keyboard Access and keyboard navigation

Full Keyboard Access highlights the item that has focus and lets you move around with the keyboard instead of a pointer. You can change the highlight's color, contrast and size, which helps a lot on a busy screen.

1. Open System Settings → **Accessibility → Motor → Keyboard**.
2. Switch on **Full Keyboard Access**.

The keys:

- `Tab` / `⇧Tab`: next or previous element.
- `Space`: select or press the focused item.
- Arrow keys: move within a group.
- `⌃Tab` / `⌃⇧Tab`: next or previous item.
- `Tab`-`H`: opens Commands Help, a list of everything else.
- `⌃⌥⌘P`: Pass-Through Mode, for apps that need those keys themselves.

On macOS 14 Sonoma there's also a lighter setting called **Keyboard navigation** in System Settings → Keyboard. With it on, Tab moves to every control; with it off, Tab only moves between text boxes and lists. `⌃F7` flips between the two. Our [Full Keyboard Access guide](https://nomousemode.com/full-keyboard-access-mac) goes deeper.

The catch: Tab visits controls one at a time, in order. Reaching the twentieth button in a toolbar means a lot of presses, and many web pages and custom-drawn apps don't play nicely with it.

## Built in: the focus shortcuts

These jump straight to parts of the screen that Tab can't easily reach. Some need switching on first in System Settings → Keyboard → Keyboard Shortcuts → Keyboard. On some keyboards you add Fn (for example Fn-Control-F2).

| Shortcut | Moves focus to |
|---|---|
| ⌃F2 | The menu bar. Use the arrows to move, Return to open or choose, or type an item's name. |
| ⌃F3 | The Dock |
| ⌃F4 | The active window or the next one |
| ⌃F5 | The window's toolbar |
| ⌃F8 | The status menus on the right of the menu bar |

## Built in: Mouse Keys

Mouse Keys turns part of your keyboard into a pointer. Turn it on in System Settings → **Accessibility → Pointer Control → Mouse Keys**, or press `⌥⌘F5` to open the Accessibility Shortcuts panel. Then:

- **Move:** `7` `8` `9` `U` `O` `J` `K` `L` (or the numeric keypad).
- **Click:** `I` (keypad 5).
- **Press and hold:** `M` (keypad 0); **release:** `.`

It works with no pointer device at all, and it's free. The big limit, in Apple's words: "When Mouse Keys is on, you can't use the keyboard or numeric keypad to enter text." So you toggle it constantly. One of its options lets you press Option five times to do that. We compare it head to head in [No Mouse Mode vs Mouse Keys](https://nomousemode.com/no-mouse-mode-vs-mouse-keys), and cover the details in [how to move the mouse with the keyboard](https://nomousemode.com/move-mouse-with-keyboard-mac).

## Built in: Voice Control

If you'd rather talk than type, turn on System Settings → Accessibility → **Voice Control**. Say "Show numbers" (or "Show names") and on-screen items get labels; say "Click" and the number to press one. "Show grid" puts a numbered grid over the screen, "Show window grid" limits it to the front window, and saying a grid number zooms in. "Hide numbers", "Hide grid" and "Stop listening" put it away.

It's powerful and free, but speaking every click is slow for a full workday and awkward in a shared office.

## What about Control-click?

Apple calls a right-click a "secondary click or Control-click": hold `Control` while you click. That still needs a working mouse or trackpad. For keyboard-only ways, including the Contextual Menu key on some Apple keyboards, see [how to right-click without a mouse](https://nomousemode.com/right-click-without-mouse-mac).

## No Mouse Mode: click anything, steer when you need to

[No Mouse Mode](https://nomousemode.com/) is a menu bar app that fills the gaps above. It gives you two ways to work, and you can mix them.

### Click labels (`⇧⌘Space`)

Every button, link, tab, menu, the menu bar and the Dock get a short letter label. Type the letters and it's clicked. Hold `⇧` with the last letter to right-click, `⌘` to Command-click (a new tab in browsers), `⌥` to double-click, or `⌃` to just move the pointer there. Tab keeps labels coming back for several clicks in a row, and labels for a window stay the same each time, so your fingers learn them.

### Type to click (`⇧⌘/`)

Type part of what a button says, and press Return. Case, spaces and accents don't matter, and initials work: "nf" finds New Folder.

### Scroll areas (`⇧⌘J`)

Every scrollable pane gets a number. Pick one, then scroll with J/K or the arrows, page with Space, and jump to the top or bottom with T and B.

### W A S D pointer mode (`⇧⌘M`)

For things that aren't buttons, like a spot in a photo or a slider, turn No Mouse Mode on. `W` `A` `S` `D` move the pointer smoothly and it eases in; hold Shift to go fast or Q for one-pixel precision. `Space` clicks (twice to double-click, hold to drag), `Return` right-clicks, `M` middle-clicks, and the arrow keys scroll. Click into a text box and it turns itself off so you can type.

### Jump grid (`E`)

A 3×3 grid labelled Q W E / A S D / Z X C covers the screen and zooms in with each press, so two or three keys reach any point. It works in every app, even ones that don't describe their buttons to macOS.

Honest trade-off: labels depend on apps telling macOS where their buttons are. Most do. For ones that don't, you can turn on optional on-screen text reading (Apple's on-device text recognition, needs Screen Recording; nothing is saved or sent), or use the grid and W A S D, which work everywhere.

## Every method compared

|  | Full Keyboard Access | Mouse Keys | Voice Control | No Mouse Mode |
|---|---|---|---|---|
| Price | Free, built in | Free, built in | Free, built in | $19.99 one time, 1 Mac (as of October 2026) |
| Click a specific button | Tab to it, then Space | Steer the pointer there | Say its number or name | Type its label or name |
| Move the pointer | No | Yes, number keys | Grid by voice | Yes, W A S D plus grid |
| Right-click | Control-click needs a pointer | Needs Alternate pointer actions | Yes, by voice | Yes, Return or ⇧ + label |
| Scroll a chosen pane | n/a | n/a | n/a | Yes, scroll areas |
| Type while it's on | Yes | No | Dictation | Label shortcuts work any time; pointer mode turns off in text boxes |
| Works with no pointer device | Yes | Yes | Yes | Yes |

Other apps do parts of this too. [Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow) ($49.99 one time as of October 2026) and [Shortcat](https://nomousemode.com/no-mouse-mode-vs-shortcat) focus on clicking by label or search. Vimac, the free open-source app that became Homerow, hasn't been updated since 2022 (see [Vimac alternatives](https://nomousemode.com/vimac-alternative)). The roundup is in [the best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) and [Homerow alternatives](https://nomousemode.com/homerow-alternatives).

Coming from another tool? We've written guides for [Vimium users](https://nomousemode.com/vimium-for-mac) (browser link hints only reach the web page, not Finder or the Dock), [keynav](https://nomousemode.com/keynav-for-mac) (X11 only, no macOS) and [warpd](https://nomousemode.com/warpd-for-mac) (not updated since 2023).

## Set up a mouse-free Mac in 5 minutes

1. **Turn on Full Keyboard Access** in System Settings → Accessibility → Motor → Keyboard. Tab and Space now reach most controls.
2. **Learn `⌃F2` and `⌃F3`** for the menu bar and Dock. If they do nothing, switch them on in System Settings → Keyboard → Keyboard Shortcuts → Keyboard.
3. **Add a way to click anything.** [Download No Mouse Mode](https://nomousemode.com/download), drag it to Applications and open it. The guided setup walks you through Accessibility permission and your license key.
4. **Click by label.** Press `⇧⌘Space` and type the letters on whatever you want to click.
5. **Steer when you need to.** Press `⇧⌘M`, move with W A S D, click with Space, right-click with Return, and press E for the grid.
6. **Practise.** Open the Practice window from the menu bar icon for nine short hands-on lessons. Press H whenever you forget a key.

Stuck on a step? The [support page](https://nomousemode.com/support) covers permissions, licenses and every key.

## Tips that make keyboard-only stick

The first day is the hardest. A few habits help:

- **Click by label first, steer second.** Most clicks are on buttons, links and menus. Labels or type to click get you there in two or three keys; save W A S D and the grid for everything else.
- **Let it switch itself off.** No Mouse Mode turns itself off when you click into a text box, and you can list apps where it always stays off, such as a game or a code editor with its own keys.
- **Try hold-to-use.** If a toggle feels like one more thing to remember, set it to work only while you hold Right Command or Right Option.
- **Save your common spots.** Press `⇧` and a number over a spot you hit all the time, then the number alone jumps back there.
- **Keep the built-ins.** `⌃F2` for the menu bar and `⌘Space` for Spotlight still work alongside everything else.

On privacy: No Mouse Mode never stores or sends your keystrokes. It only goes online to activate and re-check your license and to check for updates.

## Which should you use?

- **Trackpad broken for a day:** Full Keyboard Access and Mouse Keys will get you through, for free.
- **You'd rather speak:** Voice Control.
- **Keyboard-only all day, in every app:** built-ins plus an app that clicks by label and steers the pointer. That's the job [No Mouse Mode](https://nomousemode.com/) was built for. See [pricing](https://nomousemode.com/#pricing).

**Click anything on your Mac by typing** No Mouse Mode puts a short label on every button, link, menu and Dock icon, and lets you steer the pointer with W A S D when you need it. Price and checkout: https://nomousemode.com/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).

## FAQ

### Can you use a Mac with only a keyboard?

Yes. Turn on Full Keyboard Access in System Settings → Accessibility → Motor → Keyboard to move between controls with Tab and press them with Space. Control-F2 reaches the menu bar and Control-F3 the Dock. For anything that needs a pointer, Mouse Keys moves it with the number keys, or an app like [No Mouse Mode](https://nomousemode.com/) lets you click buttons by typing their labels.

### How do I control the mouse with the keyboard on a Mac?

Turn on Mouse Keys in System Settings → Accessibility → Pointer Control. Then 7 8 9 U O J K L move the pointer and I clicks. You can't type text while it's on. [No Mouse Mode](https://nomousemode.com/) uses W A S D instead, with smooth movement, a fast and a precise mode, and Space to click. See [how to move the mouse with the keyboard](https://nomousemode.com/move-mouse-with-keyboard-mac).

### How do I right-click without a mouse on a Mac?

With a working trackpad, hold Control and click. Keyboard only, macOS offers Alternate pointer actions or Voice Control. In [No Mouse Mode](https://nomousemode.com/), Return right-clicks where the pointer is, and holding Shift while you type a label's last letter right-clicks that button. The full list is in [how to right-click without a mouse](https://nomousemode.com/right-click-without-mouse-mac).

### My trackpad stopped working. How do I turn on Bluetooth without it?

Apple's tip: press Command-Space, type Bluetooth File Exchange, press Return, then press Return again to turn Bluetooth on. More fixes are in [what to do when your Mac trackpad isn't working](https://nomousemode.com/mac-trackpad-not-working).

### Is there a free way to click buttons by keyboard on a Mac?

Yes. Full Keyboard Access is built in and free, and Voice Control's "Show numbers" labels on-screen items for you to click by voice. Free open-source apps exist too, such as Scoot. [The best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) compares them with paid ones.

### Does No Mouse Mode have a free trial?

No. It's $19.99 one time for 1 Mac, with free updates and no subscription. The [website](https://nomousemode.com/) has interactive demos that use the same keys, so you can try how it feels before you [buy](https://nomousemode.com/#pricing).

### Which macOS versions does No Mouse Mode work on?

macOS 14 Sonoma or later, including Sequoia and Tahoe, on Apple silicon and Intel Macs.

## Related

- [Move the mouse with the keyboard](https://nomousemode.com/move-mouse-with-keyboard-mac) — Mouse Keys vs W A S D: exact keys and when each is enough.
- [Right-click without a mouse](https://nomousemode.com/right-click-without-mouse-mac) — Control-click, the Contextual Menu key, Voice Control and keyboard-only ways.
- [Full Keyboard Access on Mac](https://nomousemode.com/full-keyboard-access-mac) — Turn it on, learn the Tab, Space and Control-F keys, and know its limits.
- [Best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) — Twelve mouseless tools ranked by use case, with prices and status.
