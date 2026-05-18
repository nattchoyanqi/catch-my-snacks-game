# Catch My Snacks! 🐻🍓

A retro-style, pixel-art arcade game built using vanilla HTML5, CSS3, and JavaScript. Players control a hungry bear trying to catch falling snacks while dodging pesky snails. 

---

## 🎮 Live Preview & Features

*   **Retro Aesthetic:** Styled with the classic `Press Start 2P` pixel font and custom GIF character animations.
*   **Fully Responsive Canvas:** The game uses dynamic aspect-ratio scaling to shrink or grow perfectly depending on the user's screen size.
*   **Cross-Platform Controls:** 
    *   *Desktop:* Use your mouse cursor to track and glide the bear across the screen / Use the keyboard left and right arrows to move the bear. 
*   **Dynamic Difficulty:** Falling items automatically speed up as your score passes milestone markers ($50+$ and $100+$ points).
*   **High Score Memory:** Uses the browser's `localStorage` API to save your personal high score locally, even if you refresh or close the tab.
*   **Built-in Jukebox:** A custom audio selection tool that allows players to switch backing music tracks mid-game.

---

## 🍉 Game Rules & Scoring

The rules are simple, but the pace picks up quickly:

| Item | Points / Effect |
| :--- | :--- |
| **Honey Jar** 🍯 | `+30 Points` (The ultimate treat!) |
| **Strawberry** 🍓 | `+10 Points` (Sweet and steady) |
| **Snail** 🐌 | `-20 Points` & briefly stuns/slows the bear |

*   **The Loss Condition:** If you let **10 total snacks** hit the ground, it's **Game Over**! 
*   *Note: Dropping or missing a snail does not count against your total misses.*

---

## 🛠️ File Structure

Ensure your local game repository maintains the following folder structure for assets to load correctly:

```text
├── index.html          # Main application window structure
├── style.css           # Responsive engine and core layouts
├── script.js          # Touch controller & object physics engine
├── resources/
│   ├── favicon.png     # Browser tab logo
│   ├── background.png  # Internal arcade box backdrop
│   ├── background2.png # Main page outer wallpaper
│   ├── normal.gif      # Bear idling animation
│   ├── left.gif        # Bear walking animation
│   ├── snail.png       # Falling obstacle sprite
│   ├── strawberry.png  # Catchable asset sprite
│   └── honey.png       # Bonus points asset sprite
└── music/
    ├── 1miniCandy.mp3  # Track 1
    ├── 2handTrolley.mp3# Track 2
    └── 3cloud.mp3      # Track 3
