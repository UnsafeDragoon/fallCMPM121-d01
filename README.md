# D1 starter

A minimal TypeScript/Vite browser project with Deno checks and GitHub Pages deployment.

## Credits

Tooling adapted from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. The D1 scaffold and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies retain their respective licenses.

# D1 Project — Beer Clicker

A browser-based incremental clicking game developed using TypeScript, Deno, and Vite for CMPM 121.

In Beer Clicker, players run a bar and produce beer by clicking a glass. As production increases, players can purchase upgrades that improve manual beer production or automatically generate more beer over time.

## Play the Game

**Playable game:** [Link to game](https://unsafedragoon.github.io/fallCMPM121-d01/)

### How to Play

1. Click the beer glass to produce drops of beer.
2. Every 100 drops produced fills one glass of beer.
3. Spend accumulated drops on upgrades at the bottom of the screen.
4. Purchase upgrades to increase your production:
   - **Drops per Click (DPC):** Increases the amount of beer produced each time you click.
   - **Drops per Second (DPS):** Automatically produces beer over time.
5. Continue purchasing upgrades to increase your production.

Upgrade prices increase by 35% after each purchase. Players can only buy upgrades when they have enough drops.

The interface displays available drops, lifetime glasses served, production rates, upgrade prices, and quantities owned.

## Running Locally

### Requirements

- [Deno](https://deno.com/)
- A modern web browser

### Setup

Clone the repository:

```bash
git clone https://github.com/UnsafeDragoon/fallCMPM121-d01.git
cd fallCMPM121-d01
```

Install dependencies:

```bash
deno task setup
```

Start the development server:

```bash
deno task dev
```

Open the local URL displayed in the terminal.

### Building

If the project's Deno configuration includes a `build` task, run:

```bash
deno task build
```

The production files will be generated in the configured output directory.

## Code Structure

The main gameplay implementation is located in `src/main.ts`.

### Game State

- `dropCount`: Currently available drops that can be spent on upgrades.
- `totalDrops`: All drops produced, including those already spent.
- `currDPC`: Amount of beer produced per click.
- `currDPS`: Automatic beer production per second.

### Upgrade System

All upgrades are defined in the `upgrades` object.

Each upgrade contains:

- Name and description
- Current purchase cost
- Production bonus (`dropsPerClick` or `dropRate`)
- Quantity owned (`owned`)

Upgrade buttons are automatically generated from this shared data rather than being implemented separately.

### Important Functions

- `purchaseUpgrade()`: Validates purchases, deducts resources, applies bonuses, updates ownership, and increases prices.
- `inflatePrice()`: Calculates the next upgrade price.
- `updateUpgradeButtons()`: Updates prices, ownership counts, descriptions, and affordability.
- `updateDisplay()`: Updates the resource counters, production statistics, and glass-filling display.
- `determineProgress()`: Calculates how full the beer glass should appear.
- `frame()`: Uses `requestAnimationFrame()` and elapsed time to calculate automatic production independently of frame rate.

### Audio System

The game includes background music and sound effects to make
the bartending experience more interactive.

- Background music begins after the player's first click and loops.
- Clicking the beer glass plays a water-drip sound.
- Purchasing upgrades plays a cashier sound effect.
- The `SoundManager` class provides shared sound-effect playback
  behavior, including volume control.

## Design Revision

During development, our upgrade system initially used two separate event listeners for each upgrade button: one to process purchases and another to apply production bonuses.

Although this worked during normal gameplay, it separated purchase validation from upgrade effects and made the code harder to maintain.

We first consolidated these operations into a single event handler, ensuring that bonuses would only be applied after a successful purchase.

We later extracted the purchasing logic into a dedicated `purchaseUpgrade()` function.

This revision improved the separation of responsibilities, following the Single Responsibility Principle (SRP):

- The button event handler responds to player input.
- `purchaseUpgrade()` manages purchasing rules and game-state changes.
- `updateUpgradeButtons()` manages visual feedback for upgrades.

This makes it easier to modify purchasing behavior without rewriting the button creation or display logic.

### Relevant Commits

- [Consolidate upgrade purchase logic](https://github.com/UnsafeDragoon/fallCMPM121-d01/commit/2d0b584ef0089bd7f4ab51ce676052138403a3d6)
- [Extract purchasing logic into a dedicated function](https://github.com/UnsafeDragoon/fallCMPM121-d01/commit/7bae279a77c1976ab1d734c38595d8ca22124bce)

## Data-Driven Design

The game uses a shared upgrade model so that individual upgrades do not require separate event handlers or display implementations.

Upgrades provide either:

- `dropsPerClick`: Increases manual production.
- `dropRate`: Increases automatic production.

The same purchasing and rendering logic processes every upgrade.

Adding another upgrade generally only requires adding a new entry to the `upgrades` object.

## Asset and Documentation Credits

### Visual Assets

- **Beer glass image:** Clker-Free-Vector-Images — [Pixabay](https://pixabay.com/)
- **Background photograph:** Patrick Tomasso — [Unsplash](https://unsplash.com/)

### Documentation and References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Vite Documentation](https://vite.dev/guide/)
- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)

## Contributors

Developed collaboratively for CMPM 121.

- [Aaron Tan — aatan21]
- [Donovan Burrola — UnsafeDragoon]
