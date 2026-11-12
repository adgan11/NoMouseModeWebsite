# keynav for Mac: why it won't run, and the closest grid alternatives

Source: https://nomousemode.com/keynav-for-mac  
Updated: 2026-10-31 · Author: Ahmed Gagan (maker of No Mouse Mode)

**keynav doesn't run on macOS: its own README says it only works on X11.** If what you miss is narrowing the screen down to a spot in a few keystrokes, Mac apps can do that with a keyboard grid. Here are your options.

> **Short answer:** **keynav can't run on a Mac.** Its README says it "only works on X11", and macOS apps don't use X11. The closest thing on macOS is a keyboard grid that narrows the screen down to the spot you want. [No Mouse Mode](https://nomousemode.com/)'s jump grid does it with a 3×3 grid on `Q` `W` `E` / `A` `S` `D` / `Z` `X` `C`, two or three presses to anywhere. Free options exist too: warpd's grid mode (not updated since 2023), Voice Control's "Show grid" and Mouse Keys, each with trade-offs below.

## What keynav is, and why it stays on Linux

[keynav](https://github.com/jordansissel/keynav)'s tagline is "retire your mouse": it controls the mouse with the keyboard. It's free and open source, with about 653 stars on GitHub, and its last commit was in August 2022.

The reason you can't brew-install it on a Mac is spelled out in its README: "This project (keynav) only works on X11." The FAQ goes further: keynav is totally dependent on X11, and for macOS it suggests AppleScript instead. It doesn't support Wayland either. X11 is the window system that many Linux desktops use; macOS draws its windows with its own system, so a port isn't a weekend job, it's a rewrite.

The good news is that the idea travels. Mac apps can't reuse keynav's code, but they can do the same kind of thing through macOS's own accessibility and pointer controls.

## The idea you're probably after: narrow down, don't steer

Most "keyboard mouse" tools make you steer the pointer like a tiny car with arrow keys. Grid tools take a different route. You see the screen split into cells, press the key for the cell your target is in, the grid shrinks into that cell, and you press again. A few keystrokes later the pointer is on the spot. It's fast, it's the same number of keys whether the target is near or far, and it never needs to know what's on screen.

That last point matters on a Mac. Click-label tools (like [Vimium-style labels for the whole Mac](https://nomousemode.com/vimium-for-mac)) depend on apps describing their buttons to macOS. A grid doesn't care, so it works in games, design canvases, remote desktops and anything else.

## Keyboard grids on macOS, compared

Checked against each tool's own docs in October 2026:

|  | No Mouse Mode jump grid | warpd grid mode | Voice Control grid | Mouse Keys |
|---|---|---|---|---|
| How you narrow down | 3×3 grid, zooms in with each press | Pick quadrants repeatedly with u i j k | Say a grid number; it refines | No grid: steer with keys |
| Keys | Q W E / A S D / Z X C | u i j k | Your voice | 7 8 9 U O J K L |
| Open it | E while No Mouse Mode is on | ⌥⌘G (A-M-g) | "Show grid" | Accessibility setting |
| Click | Space click, Return right-click | m left, , middle, . right | By voice | I click (no right-click key) |
| Works in any app | Yes | Yes | Yes | Yes |
| Maintained | Yes (2.0.1) | Not updated since 2023 | Built into macOS | Built into macOS |
| Price | $19.99 one time, 1 Mac | Free, MIT | Free | Free |

## No Mouse Mode's jump grid

Press `⇧⌘M` to turn [No Mouse Mode](https://nomousemode.com/) on, then `E`. The screen with the pointer splits into a 3×3 grid labelled `Q` `W` `E` / `A` `S` `D` / `Z` `X` `C`, the same shape as those keys on your keyboard, so you don't read the labels so much as point with your fingers. Press a letter and the pointer jumps to the middle of that cell, then the grid zooms into it. Two or three presses reach anywhere.

- `Space` clicks there, `Return` right-clicks.
- `Delete` goes back a level if you picked the wrong cell.
- `Tab` moves the grid to your next display; `Esc` closes it.
- Afterwards you can fine-tune with `W` `A` `S` `D` (hold `Q` for one-pixel precision).

The grid is one part of a bigger app. When a target is a real button, `⇧⌘Space` click labels are usually faster: type the letters on it and it's clicked. You also get type to click, scroll areas, saved spots (`Shift+1`–`9` to save, `1`–`9` to jump) and every key can be remapped. It needs macOS 14 Sonoma or later on Apple silicon or Intel.

## The free options

### warpd: the closest in spirit, but quiet since 2023

[warpd](https://github.com/rvaiya/warpd) is "a modal keyboard-driven virtual pointer" for X11, Wayland (sway/wlroots) and macOS. Its grid mode (`⌥⌘G`, written A-M-g in its docs) lets you pick quadrants over and over with `u`/`i`/`j`/`k`, then `m`, `,` or `.` to click. If you used keynav on Linux and want something that feels like a Unix tool, it's the natural first try. The catch: its last commit was June 2023 and its last macOS release (v1.3.5) was November 2022, and it doesn't state a minimum macOS. Full details in [warpd for Mac](https://nomousemode.com/warpd-for-mac).

### Voice Control's "Show grid"

Built into macOS (System Settings > Accessibility > Voice Control). Say "Show grid" for a numbered grid over the screen, or "Show window grid" for just the active window. Say a number to refine it, and "Hide grid" when you're done. It's the same narrowing idea, and free, but you speak rather than type, which isn't for every room.

### Mouse Keys

Also built in (System Settings > Accessibility > Pointer Control > Mouse Keys). It moves the pointer with `7` `8` `9` `U` `O` `J` `K` `L` (or the keypad) and clicks with `I`. There's no grid, so it's steering rather than narrowing, and Apple notes that while it's on you can't use the keyboard to enter text. It's fine for an emergency; see [No Mouse Mode vs Mouse Keys](https://nomousemode.com/no-mouse-mode-vs-mouse-keys) for the long version.

### Two more grid apps

- **[Scoot](https://github.com/mjrusso/scoot)** (free, BSD-3, v1.3 March 2026): a grid mode on `⇧⌘K` with equal cells across all screens, each with a key sequence. Its README says it runs on macOS 11 and 12; newer versions aren't stated.
- **[Mouseless](https://mouseless.click)** (closed source, 14-day trial, prices not published on its site): tap Left Command to show a grid, type a cell's two characters, then Space clicks its center or a sub-grid key picks a sub-cell.

## Which should you pick?

- **You only need to click now and then:** start with Voice Control or Mouse Keys. They're free and already on your Mac.
- **You want the Unix-tool feel and don't mind risk:** try warpd, knowing it isn't being updated.
- **You want a grid plus click labels, scrolling and remappable keys in one maintained app:** [No Mouse Mode](https://nomousemode.com/), $19.99 one time for 1 Mac as of October 2026 ([pricing](https://nomousemode.com/#pricing)). There's no free trial, but the live demo on this page uses the same keys.

For the bigger picture, see [how to move the mouse with the keyboard on a Mac](https://nomousemode.com/move-mouse-with-keyboard-mac) and [the best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac).

**Reach any spot on your Mac in three keys.** Press E for a 3×3 grid on Q W E / A S D / Z X C, narrow down, then Space to click, in any app. Price and checkout: https://nomousemode.com/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).

## FAQ

### Can I install keynav on macOS?

No. keynav's README says "This project (keynav) only works on X11", and its FAQ says it is totally dependent on X11. macOS doesn't use X11 for its own apps, so there's nothing for keynav to control. There's no Wayland version either.

### What's the closest thing to keynav on a Mac?

A keyboard grid. [No Mouse Mode](https://nomousemode.com/)'s jump grid (press `E`) splits the screen into a 3×3 grid on Q W E / A S D / Z X C and zooms in with each press. warpd has a grid mode with four quadrants. Voice Control has a numbered grid you control by voice. Scoot and Mouseless also have grid modes.

### Is there a free keynav alternative for macOS?

Yes. Voice Control and Mouse Keys are built into macOS and free. warpd (MIT) and Scoot (BSD-3) are free and open source, though warpd hasn't been updated since 2023 and Scoot's README only states macOS 11 and 12. No Mouse Mode is paid: $19.99 one time for 1 Mac as of October 2026.

### Can I click and right-click from the grid?

In No Mouse Mode, yes: after narrowing down, press `Space` to click or `Return` to right-click. `Delete` goes back a level, `Tab` moves the grid to your next display and `Esc` closes it. You can still fine-tune with W A S D afterwards. In warpd's grid mode, `m`, `,` and `.` are left, middle and right click.

### Does the jump grid work in every app?

Yes. The grid doesn't need to know where an app's buttons are; it just moves the pointer to a spot on screen. That's why it works in games, design canvases and remote desktops where click labels can't see anything.

### Does it work with several displays?

Yes. The grid appears on the display the pointer is on, and `Tab` moves it to the next one. Outside the grid, `Tab` and `Shift+Tab` jump the pointer between displays.

## Related

- [warpd for Mac](https://nomousemode.com/warpd-for-mac) — warpd on macOS: fixes, maintenance status and maintained alternatives.
- [Move the mouse with the keyboard](https://nomousemode.com/move-mouse-with-keyboard-mac) — Mouse Keys vs W A S D: exact keys and when each is enough.
- [No Mouse Mode vs Mouse Keys](https://nomousemode.com/no-mouse-mode-vs-mouse-keys) — How to use Mac Mouse Keys, its limits, and an alternative.
- [Best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) — Twelve mouseless tools ranked by use case, with prices and status.
