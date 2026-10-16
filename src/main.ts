// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
// import { log } from "node:console";
import tileUrl from "./assets/clker-free-vector-images-beer-309778_1280.png?no-inline";
// import { upgrade } from "asset:///node/undici/api.d.ts";
import backgroundUrl from "./assets/patrick-tomasso-GXXYkSwndP4-unsplash.jpg?no-inline";

let dropCount = 0;
let totalDrops = 0;
let currDPS = 0;
let currDPC = 1;

const upgrades = {
  niceClothes: {
    name: "Proper Clothing",
    desc:
      "People tend to buy more beer if their bartender doesn't look like a homeless person off the street. Get a snazzy suit and tie.",

    cost: 500,
    dropsPerClick: 5,
    owned: 0,
  },
  betterBeer: {
    id: "betterBeer",

    name: "Quality Beer",
    desc:
      "Patrons have been complaining about the beer tasting akin to piss. Maybe we should order a different brand?",

    cost: 50000,
    dropsPerClick: 15,
    owned: 0,
  },
  advertising: {
    id: "advertising",

    name: "Corporate Advertising",
    desc:
      "Nothing says unstoppable conglomerate like dozens of flashy buildboards wherever you turn! Sit back, and let your beer slaves do all the work. You earned this.",

    cost: 1000000,
    dropsPerClick: 50,
    owned: 0,
  },

  moreTap: {
    id: "moreTap",

    name: "More Taps",
    desc:
      "Purchase another tap to simultaneously operate along with everything else! Practically automatic!",

    cost: 5,
    dropRate: 0.1,
    owned: 0,
  },
  barry: {
    name: "Barry",
    desc:
      "Purchase the big man himself! He'll help you do all you need, drinking your supply included! He's cloneable, so buy a thousand of him!",

    cost: 100,
    dropRate: 1,
    owned: 0,
  },
  beerKeg: {
    name: "Beer Keg",
    desc:
      "Buy some beer kegs, ran by local college students, that will never stop flowing!",

    cost: 500,
    dropRate: 10,
    owned: 0,
  },
  beerShowers: {
    name: "Beer Shower",
    desc: "Construct dedicated showers that only dispense beer 24/7!",

    cost: 2000,
    dropRate: 50,
    owned: 0,
  },
  beerSlide: {
    name: "Beer Slip-n-Slide",
    desc:
      "Some patrons have requested to slide on our beer, we may happily oblige.",

    cost: 10000,
    dropRate: 100,
    owned: 0,
  },
  beerRiver: {
    name: "River of Beer",
    desc:
      "Mother nature itself cannot stop our unstoppable growth! We will carve the land and fill it with our homebrew!",

    cost: 200000,
    dropRate: 250,
    owned: 0,
  },
  beerGieser: {
    name: "Beer Gieser",
    desc:
      "So much beer production that it turns explosive! Beer falls like rain! Have we gone too far? I say, not far enough!",

    cost: 1000000,
    dropRate: 500,
    owned: 0,
  },
};

const app = document.querySelector<HTMLElement>("#app")!;
app.style.display = "flex";
app.style.flexDirection = "column";
app.style.height = "100vh";

app.style.backgroundImage =
  `linear-gradient( rgba(0,0,0,.5), rgba(0, 0, 0, 0.81) ), 
  url("${backgroundUrl}")`;
app.style.backgroundSize = "100%";

const heading = document.createElement("h1");
heading.textContent = "D1 project";
heading.style.whiteSpace = "pre-line";
heading.style.marginLeft = "auto";
heading.style.marginRight = "auto";
heading.style.marginBottom = "0";

heading.style.color = "white";

app.append(heading);

const statsDisplay = document.createElement("p");

statsDisplay.style.fontSize = "18px";
statsDisplay.style.textAlign = "center";
statsDisplay.style.whiteSpace = "pre-line";

statsDisplay.style.color = "white";

app.append(statsDisplay);

const progContainer = document.createElement("div");
progContainer.style.width = "300px";
progContainer.style.height = "300px";

progContainer.style.marginLeft = "auto";
progContainer.style.marginRight = "auto";

progContainer.style.paddingLeft = "75px";

progContainer.style.position = "relative";
progContainer.style.display = "flex";

app.append(progContainer);

const progressBar = document.createElement("div");
const maxHeight = 95;
progressBar.style.height = `${maxHeight}%`;

progressBar.style.width = "60%";
progressBar.style.marginLeft = "4%";
progressBar.style.marginTop = "auto";
progressBar.style.marginBottom = "2.5%";

progressBar.style.backgroundColor = "#ffa73b";

progContainer.append(progressBar);

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "Beer glass - click to pour beer";
image.width = 300;
image.height = 300;
image.draggable = false;

image.style.cursor = "pointer";

image.style.position = "absolute";
image.style.top = "0";

progContainer.append(image);

const upgradeContainer = document.createElement("div");

upgradeContainer.style.display = "flex";
upgradeContainer.style.flexDirection = "row";
upgradeContainer.style.flexWrap = "wrap";
upgradeContainer.style.justifyContent = "center";
upgradeContainer.style.gap = "10px";

upgradeContainer.style.marginTop = "50px";
upgradeContainer.style.bottom = "20px";
upgradeContainer.style.left = "0";
upgradeContainer.style.width = "100%";

app.append(upgradeContainer);

function inflatePrice(cost: number) {
  return (cost * 1.35);
}

type Upgrade = (typeof upgrades)[keyof typeof upgrades];

const upgradeButtons: {
  button: HTMLButtonElement;
  upgrade: Upgrade;
}[] = [];

for (const [id, upgrade] of Object.entries(upgrades)) {
  const button = document.createElement("button");
  button.title = upgrade.desc;
  button.id = id;

  button.style.width = "140px";
  button.style.height = "100px";
  button.style.padding = "8px";
  button.style.fontSize = "14px";
  button.style.cursor = "pointer";
  button.style.whiteSpace = "pre-line";

  upgradeButtons.push({
    button: button,
    upgrade: upgrade,
  });

  button.addEventListener("click", () => {
    purchaseUpgrade(upgrade);
    updateDisplay();
  });

  upgradeContainer.append(button);
}

function purchaseUpgrade(upgrade: Upgrade) {
  if (dropCount < upgrade.cost) {
    return;
  }

  dropCount -= upgrade.cost;

  if ("dropsPerClick" in upgrade) {
    currDPC += upgrade.dropsPerClick;
  } else {
    currDPS += upgrade.dropRate;
  }

  upgrade.owned++;
  upgrade.cost = inflatePrice(upgrade.cost);
}

function updateUpgradeButtons() {
  for (const entry of upgradeButtons) {
    const button = entry.button;
    const upgrade = entry.upgrade;

    let bonusText = "";
    if ("dropsPerClick" in upgrade) {
      bonusText = `+${upgrade.dropsPerClick} Drops/click`;
    } else {
      bonusText = `+${upgrade.dropRate} Drops/sec`;
    }

    button.textContent = `${upgrade.name}\n` +
      `${Math.floor(upgrade.cost * 10) / 10} Drops\n` +
      `${bonusText}\n` +
      `Owned: ${upgrade.owned}`;

    // disable the button if the player doesn't have enough drops to purchase the upgrade
    if (dropCount < entry.upgrade.cost) {
      entry.button.disabled = true;
      entry.button.style.cursor = "default";
      entry.button.style.backgroundColor = "#daa37e";
    } else {
      entry.button.disabled = false;
      entry.button.style.cursor = "pointer";
      entry.button.style.backgroundColor = "#db7937";
    }
  }
}

function updateDisplay() {
  heading.textContent = `Drops: ${
    Math.floor(dropCount * 10) / 10
  } \n Glasses Served: ${Math.floor(totalDrops / 100)}`;

  statsDisplay.textContent =
    `Drops per click: ${currDPC} \n Drops per second: ${
      Math.floor(currDPS * 10) / 10
    }`;

  progressBar.style.height = `${determineProgress(totalDrops)}%`;

  updateUpgradeButtons();
}

image.addEventListener("click", () => {
  dropCount += currDPC;
  totalDrops += currDPC;
  updateDisplay();
});

function determineProgress(drops: number) {
  const singleMug = drops % 100;
  return (singleMug / 100) * maxHeight;
}

let LastTime: number | undefined;

function frame(Time: number) {
  if (LastTime === undefined) {
    LastTime = Time;
  }
  const deltaTime = (Time - LastTime) / 1000;
  LastTime = Time;

  dropCount += currDPS * deltaTime;
  totalDrops += currDPS * deltaTime;

  updateDisplay();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
updateDisplay();
