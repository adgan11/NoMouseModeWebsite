# warpd on Mac: fixes to try, and maintained alternatives for each mode

Source: https://nomousemode.com/warpd-for-mac  
Updated: 2026-10-31 · Author: Ahmed Gagan (maker of No Mouse Mode)

**warpd does have a macOS build, but the last one is v1.3.5 from November 2022 and the project hasn't changed since June 2023.** Here's what to try when it stops working, and which maintained apps cover its hint, grid and normal modes.

> **Short answer:** **warpd still has a macOS build, but it's old.** The last Mac release is v1.3.5 from November 2022, the last commit was June 2023, and the README doesn't say which macOS versions it supports. If it runs for you, it's free and great. If it stops working, try resetting its Accessibility permission (below). If you'd rather have something maintained, [No Mouse Mode](https://nomousemode.com/) covers all three warpd modes: hint mode becomes click labels, grid mode becomes the jump grid, and normal mode becomes W A S D movement. Scoot is a free option with a similar three-mode design.

## What warpd does

[warpd](https://github.com/rvaiya/warpd) calls itself "a modal keyboard-driven virtual pointer". It's free and open source under the MIT license, with about 3,660 stars on GitHub, and it runs on X11, Wayland (sway/wlroots only) and macOS. It has three modes. In its docs, `A-M` means Alt+Meta, and Meta is Command on macOS, so `A-M-x` is `⌥⌘X`.

- **Hint mode** (`⌥⌘X`): shows hints on screen; type one and the pointer warps there.
- **Grid mode** (`⌥⌘G`): pick quadrants over and over with `u`/`i`/`j`/`k` until you're on target; `m`, `,` and `.` click left, middle and right.
- **Normal mode** (`⌥⌘C`): move with `h` `j` `k` `l`, click with `m`/`,`/`.`, drag with `v`, quit with `Esc`.

On a Mac you install it from a prebuilt v1.3.5 tarball plus `launchctl`, or build it from source with the Xcode command line tools.

## Is warpd still maintained?

Here's what its GitHub repository shows as of October 2026:

| Item | warpd |
|---|---|
| Last commit | June 3, 2023 |
| Last macOS release | v1.3.5, November 5, 2022 |
| Last release overall | v1.3.7-windows-alpha, April 26, 2023 |
| Open issues | 90 |
| Archived | No |
| Minimum macOS | Not stated |

So the fair summary is "not updated since 2023". That doesn't mean it's broken: plenty of finished tools keep working for years. It does mean that if a future macOS change breaks it, nobody is shipping a fix right now, and we can't promise either way how it behaves on the macOS you're running.

## warpd not working? Things to try

1. **Check the Accessibility permission.** Open System Settings > Privacy & Security > Accessibility and make sure warpd is switched on. Tools that move the pointer need this.
2. **Reset the permission after an upgrade.** warpd's README says upgrading may need `sudo tccutil reset Accessibility`. Be aware this clears the whole Accessibility list, so you may have to re-allow other apps afterwards. Then allow warpd again.
3. **Expect the pointer-hiding quirk.** The README notes that warpd's trick for hiding the pointer doesn't work in some programs, iTerm being the example. That's a known limitation, not a broken install.
4. **Check the open issues.** With 90 open issues on [GitHub](https://github.com/rvaiya/warpd/issues), someone may already have hit your problem and posted a workaround.

If none of that helps, it may be time for something that's still being updated.

## Each warpd mode, mapped to No Mouse Mode

[No Mouse Mode](https://nomousemode.com/) is a menu bar app with the same three ideas, plus a few warpd doesn't have. Every key can be remapped, so these are just the defaults.

| warpd | warpd key | No Mouse Mode |
|---|---|---|
| Hint mode | ⌥⌘X, type a hint | Click labels: ⇧⌘Space anywhere (or F while on), type a label and it's clicked |
| Grid mode | ⌥⌘G, quadrants on u i j k | Jump grid: E, a 3×3 grid on Q W E / A S D / Z X C that zooms with each press |
| Normal mode | ⌥⌘C, move with h j k l | ⇧⌘M turns it on; move with W A S D (smooth, eases in) |
| Left / middle / right click | m / , / . | Space / M / Return |
| Drag | v | Hold Space and move |
| Quit the mode | Esc | ⇧⌘M (or let it switch off when you click into a text box) |
| Speed control | n/a here | Hold Shift for fast, Q for one-pixel precise |
| Scrolling | n/a here | Arrow keys; Scroll areas ⇧⌘J numbers each pane |
| Click by name | none | Type to click: ⇧⌘/, type part of a button's name |

### Hint mode → click labels

This is the biggest difference. warpd's README describes its hints as positions on the screen; it doesn't say they come from buttons. No Mouse Mode's labels are put on real buttons, links, tabs, menus, the menu bar and the Dock, using what apps tell macOS about themselves, so typing a label clicks that item. Hold `⇧` with the last letter to right-click, `⌘` to ⌘-click, `⌥` to double-click or `⌃` to just move the pointer there. The trade-off: apps that don't describe their buttons show few labels. For those you can turn on on-device text recognition (it needs Screen Recording permission; nothing is saved or sent), or use the grid.

### Grid mode → jump grid

warpd splits into four quadrants per press; No Mouse Mode splits into nine, laid out like the `Q`–`C` block under your left hand, so two or three presses reach anywhere. `Space` clicks, `Return` right-clicks, `Delete` goes back a level and `Tab` moves the grid to the next display. Like warpd's grid, it works in any app because it doesn't need to know what's on screen. The [keynav for Mac](https://nomousemode.com/keynav-for-mac) guide compares every keyboard grid on macOS.

### Normal mode → W A S D

Instead of `h` `j` `k` `l`, movement defaults to `W` `A` `S` `D`, and it eases in so short taps are small and holding goes further. Shortcuts with ⌘, ⌃ or ⌥ still reach your apps while it's on. You also get back/forward buttons (`[` / `]`), saved spots (`Shift+1`–`9` to save, `1`–`9` to jump) and ``` to jump back. More in [how to move the mouse with the keyboard on a Mac](https://nomousemode.com/move-mouse-with-keyboard-mac).

## Other maintained options

- **[Scoot](https://github.com/mjrusso/scoot)** (free, BSD-3, v1.3 in March 2026): the closest free match to warpd's shape, with element labels (`⇧⌘J`), a grid (`⇧⌘K`) and a freestyle mode that nudges the pointer with macOS, Emacs or vi keys (`⇧⌘L`). Its README says it runs on macOS 11 and 12 and doesn't mention newer versions.
- **[Mouseless](https://mouseless.click)** (closed source, 14-day trial, prices not published on its site, v1.1.0 in October 2026): a grid mode on Left Command and a free-movement mode on Left Option with I/J/K/L.
- **[Homerow](https://www.homerow.app)** ($49.99 one time as of October 2026, macOS 13 or later): labels, scroll and search. See [No Mouse Mode vs Homerow](https://nomousemode.com/no-mouse-mode-vs-homerow).
- **Mouse Keys** (built in, free): fixed-pace pointer movement with `7` `8` `9` `U` `O` `J` `K` `L`. Compared in [No Mouse Mode vs Mouse Keys](https://nomousemode.com/no-mouse-mode-vs-mouse-keys).

## Which should you use?

- **warpd still runs for you:** keep it. It's free and does the job.
- **You want free and open source:** try Scoot, checking it on your macOS version first.
- **You want all three modes plus type to click and scroll areas, maintained, with a guided setup:** [No Mouse Mode](https://nomousemode.com/), $19.99 one time for 1 Mac ([pricing](https://nomousemode.com/#pricing)), macOS 14 Sonoma or later on Apple silicon and Intel. No free trial, but the live demo on this page uses the same keys.

The full field is in [the best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac).

**warpd's three modes, in a maintained Mac app.** Click labels, a 3×3 jump grid and smooth W A S D movement, on macOS 14 Sonoma or later. Price and checkout: https://nomousemode.com/#pricing ($19.99 one-time for 1 Mac, free updates; macOS 14+ on Apple silicon and Intel).

## FAQ

### Does warpd work on macOS?

warpd lists macOS as a supported platform, with a prebuilt v1.3.5 download or a source build using the Xcode command line tools. That macOS build is from November 2022, the last commit was June 2023, and the README doesn't state a minimum macOS version, so we can't tell you whether it works on yours. The only way to know is to try it.

### warpd stopped working after I upgraded it. What do I do?

warpd's README notes that upgrading may need `sudo tccutil reset Accessibility`, so macOS asks for the Accessibility permission again. That command resets the Accessibility list, so other apps there may need to be allowed again too. Then re-allow warpd in System Settings > Privacy & Security > Accessibility.

### Is warpd abandoned?

We'd say "not updated since 2023". The repository isn't archived and has 90 open issues, but the last commit was June 3, 2023 and the last macOS release was v1.3.5 on November 5, 2022. It's free and MIT-licensed, so it may still suit you if it runs on your Mac.

### What's the closest maintained alternative to warpd on a Mac?

If you want free and open source with the same three-mode shape, look at [Scoot](https://github.com/mjrusso/scoot) (element, grid and freestyle modes, v1.3 in March 2026), though its README only states macOS 11 and 12. [No Mouse Mode](https://nomousemode.com/) covers all three warpd modes plus type to click and scroll areas, for $19.99 one time on macOS 14 or later.

### Are No Mouse Mode's click labels the same as warpd's hints?

Not quite. warpd's README describes its hints as positions on the screen. No Mouse Mode's labels sit on real buttons, links, tabs and menus that apps describe to macOS, so typing one clicks that item. For apps that don't describe their buttons, it can optionally read on-screen text, and the jump grid and W A S D work everywhere.

### Can I use hjkl in No Mouse Mode like warpd's normal mode?

The defaults are W A S D, but every key and shortcut can be remapped in Settings, so you can set movement to the keys your fingers already know.

## Related

- [keynav for Mac](https://nomousemode.com/keynav-for-mac) — keynav is X11-only. The closest keyboard-grid options on macOS.
- [Vimac alternatives](https://nomousemode.com/vimac-alternative) — Vimac is now Homerow. What replaces it today.
- [Move the mouse with the keyboard](https://nomousemode.com/move-mouse-with-keyboard-mac) — Mouse Keys vs W A S D: exact keys and when each is enough.
- [Best keyboard mouse apps for Mac](https://nomousemode.com/best-keyboard-mouse-apps-for-mac) — Twelve mouseless tools ranked by use case, with prices and status.
