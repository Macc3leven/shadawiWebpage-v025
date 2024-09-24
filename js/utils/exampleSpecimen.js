const assetApiUrl = "https://dawi-asset-api-725ca903b96f.herokuapp.com/";
const attributes = ["class","purg_lvl","skil","build","population","form","max_form","size"];
const stats = ["health","dammage","defense","time","stun","agility","power"];

const specimenMockQuery = [
  {
    // info
    name: "Domigra",
    sid: 101,
    description: "Puny purgator, bring me to the fight",
    creator: "oneiric",
    abilities: ["zephr Display", "Inferno Dragon Summoning"],
    files: [
      {
        content: "mugshot",
        src: "./images/domig.png",
      },
      {
        content: "basemodel",
        src: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/prefab_1000.glb",
      },
    ],

    // attributes
    class: "undead",
    purg_lvl: "supermighty",
    skill: "samurai",
    build: "base",
    population: 721,
    form: 1,
    max_form: 1,
    size: "humanoid",

    // Stats
    health: 4000,
    damage: 1020,
    defense: 600,
    time: 2,
    stun: 400,
    agility: 701,
    power: 611,
  },
  {
    // info
    name: "Mighty Bird",
    sid: 102,
    description:
      "In the ancient depths of the Shadawi Universe, there exists a celestial avian known as the Mighty Bird. Born into the revered Chinon family, guardians of cosmic balance and wielders of ancient energy, the Mighty Bird",
    creator: "oneiric",
    abilities: ["wing slap", "Nest Cannon"],
    files: [
      {
        content: "mugshot",
        src: "./images/mightybird.png",
      },
      {
        content: "basemodel",
        src: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/prefab_1000.glb",
      },
    ],

    // attributes
    class: "divine",
    purg_lvl: "mighty",
    skill: "mystical",
    build: "colors",
    population: 2021,
    form: 1,
    max_form: 4,
    size: "humanoid",

    // Stats
    health: 8000,
    damage: 2300,
    defense: 700,
    time: 7,
    stun: 300,
    agility: 323,
    power: 911,
  },
  {
    // info
    name: "Cloud Ogre",
    description: `I am known as Cloud Ogre, a being bound to the gaseous realm. Within me resides Jejar, a sentient cloud that evolves with my essence, more than just an extension—it is part of my soul. Once, my kind thrived until the divine entity Doomshade ravaged our land. In that chaos, I found newfound strength, amplifying my power tenfold. That encounter fueled my relentless pursuit of power, knowledge, and revenge. Over the ages, I've watched civilizations rise and fall, ruling my own kingdom. My greatest gift is my ability to shift forms. In my first form, I radiate mystic fire, a pure gas entity. In my second, I embrace raw physical might. But in my divine form, I become truly invincible, unmatched in strength and will. This is my story.`,
    creator: "oneiric",
    abilities: ["warriors melee", "Flamethower III"],
    files: [
      {
        content: "mugshot",
        src: "./images/cloudogre.png",
      },
      {
        content: "basemodel",
        src: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/prefab_1000.glb",
      },
    ],

    // attributes
    class: "gas",
    purg_lvl: "strong",
    skill: "sorcerer",
    build: "evo",
    population: 721,
    form: 1,
    max_form: 3,
    size: "humanoid",

    // Stats
    health: 4000,
    damage: 1020,
    defense: 600,
    time: 2,
    stun: 223,
    agility: 941,
    power: 445,
  },
  {
    // info
    name: "Seapunk",
    sid: 104,
    description: `Seapuk was once a peaceful spirit of the wind, guiding ships safely through the fog. His life changed when a shipwrecked mage bound him to a cursed plank of driftwood. The plank, alive with dark magic, fed on Seapuk's energy, trapping him in the physical world and transforming him into a fearsome force known as the Driftwood Warden. Seapuk, now bound to the plank, seeks a way to break free. When a mysterious figure offers a chance at freedom, Seapuk must face the original wielder of the plank—a malevolent spirit. His fate now rests on the outcome of this final, perilous battle.`,
    creator: "oneiric",
    abilities: ["zephr Display", "Inferno Dragon Summoning"],
    files: [
      {
        content: "mugshot",
        src: "./images/seapunk.png",
      },
      {
        content: "basemodel",
        src: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/prefab_1000.glb",
      },
    ],

    // attributes
    class: "gas",
    purg_lvl: "weak",
    skill: "cursed",
    build: "base",
    population: 3001,
    form: 1,
    max_form: 1,
    size: "humanoid",

    // Stats
    health: 3000,
    damage: 855,
    defense: 280,
    time: 2,
    stun: 605,
    agility: 998,
    power: 109,
  },
];

function getSpecimenAssets(spec = specimenMockQuery[0]) {
  const { files } = spec;

  return {
    mugshot: files.find((f) => f.content == "mugshot"),
    prefab: files.find((f) => f.content == "prefab"),
    terrain: files.find((f) => f.content == "terrain"),
  };
}

export { assetApiUrl, specimenMockQuery, attributes, stats, getSpecimenAssets };
