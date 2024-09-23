const assetApiUrl = "https://dawi-asset-api-725ca903b96f.herokuapp.com/";
const specimenObject = {
  SID: 102,
  name: "Mighty Bird",
  totalForms: 1,
  population: 8,
  owned: 0,
  family: "Chinon",
  trait: "mystical",
  build: "evo",
  class: "divine",
  purgLvl: "mighty",
  creator: "Oneiric",
  knownAbilities: "Wing Slap, Nest Cannon",
  locations: {
    assetsDirectory: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG",
    mainDirectory: "Qmf9RhwSugiT2Q1v2eevWVTjytyPpmZiZxusrxCPP7EtkF",
  },
  forms: [
    {
      abilityPack: [],
      size: "humanoid",
      owned: 0,
      class: "divine",
      build: "evo",
      form: 1,
      health: 6705,
      damage: 1201,
      defense: 400,
      time: 8,
      stun: 447,
      agility: 277,
      power: 907,
    },
  ],
  created_at: 1671673885902,
  updatedAt: 1715463368134,
  description:
    "In the ancient depths of the Shadawi Universe, there exists a celestial avian known as the Mighty Bird. Born into the revered Chinon family, guardians of cosmic balance and wielders of ancient energy, the Mighty Bird possesses a beak imbued with the power to consume, store, and disburse cosmic energies.",
  abilities: [
    {
      form: "*",
      skin: "*",
      type: "strike",
      skill: "martial arts",
      name: "Wing Slap",
      dataname: "wingslap",
      description: "A furious wing attack",
      mods: {
        dam: 1.4,
        power: 2,
      },
      requiredPoints: 0,
    },
    {
      form: "*",
      skin: "*",
      type: "ultStrike",
      skill: "mystical",
      name: "Nest Cannon",
      dataname: "nestcannon",
      description: "A blast of high kinetic energy, made of charged particles",
      requiredPoints: 300,
      mods: {
        dam: 2.1,
        stun: 4,
      },
    },
  ],
  files: [
    {
      filename: "mugshot_1000.png",
      fileType: "png",
      content: "mugshot",
      form: 1,
      skin: 1,
      link: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/mugshot_1000.png",
    },
    {
      filename: "mugshot_2000.png",
      fileType: "png",
      content: "mugshot",
      form: 2,
      skin: 1,
      link: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/mugshot_2000.png",
    },
    {
      filename: "prefab_1000.glb",
      fileType: "glb",
      content: "prefab",
      form: 1,
      skin: 1,
      link: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/prefab_1000.glb",
    },
    {
      filename: "prefab_2000.glb",
      fileType: "glb",
      content: "prefab",
      form: 2,
      skin: 1,
      link: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/prefab_2000.glb",
    },
    {
      name: "dark-plane",
      fileType: "terrain",
      filename: null,
      jsonSrc: "QmP74foPLQERLTtz2B3h3qM3Ves4qM6prWVwSLsK7aSaQq",
    },
  ],
  skill: "mystical",
};

const specimenSchema = {
  SID: "102",
  form: 1,
  totalForms: 4,
  name: "Mighty Bird",
  formStage: "Alpha",
  class: "divine",
  build: "evo",
  skill: "mystical",
  family: "Chinon",
  creator: "Oneiric",
  owned: 0,
  population: 8,
  knownAbilities: ["Wing Slap", "Nest Cannon"],

  // Stats
  health: 6705,
  damage: 1201,
  defense: 400,
  agility: 277,
  power: 907,
  stun: 447,
  time: 8,

  files: [
    {
      filename: "mugshot_1000.png",
      fileType: "png",
      content: "mugshot",
      src: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/mugshot_1000.png",
    },
    {
      filename: "prefab_1000.glb",
      fileType: "glb",
      content: "prefab",
      form: 1,
      skin: 1,
      link: "Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/prefab_1000.glb",
    },
  ],
  description: `In the ancient depths of the Shadawi Universe, there exists a celestial avian known as the Mighty Bird. 
  Born into the revered Chinon family, guardians of cosmic balance and wielders of ancient energy, the Mighty Bird`
};

function getSpecimenAssets(spec = exampleSpecimen, formNumber = 1) {
  const { files } = spec;
  const form = spec.forms[formNumber - 1];

  return {
    abilities: spec.abilities.filter(
      (ab) => ab.form == formNumber || ab.form.includes("*")
    ),
    mugshot: files.find((f) => f.content == "mugshot" && f.form == formNumber),
    prefab: files.find((f) => f.content == "prefab" && f.form == formNumber),
    terrain: files.find((f) => f.content == "prefab"),
    form,
  };
}

export { assetApiUrl, specimenObject };
