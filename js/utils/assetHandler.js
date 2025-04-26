/** Handles getting data from the asset api and routing it
 * to content in the gallery.html, handles pagination, and makes
 * sure that certain queries are cached. */
import { specimenMockQuery } from "./exampleSpecimen.js";
const assetUrl = `https://dawi-asset-api-725ca903b96f.herokuapp.com/`;
const ipfsGateway = "https://beige-worthwhile-hornet-694.mypinata.cloud/ipfs/";
const resourceNames = ["specimen", "tokens", "owners"];

/** Small issue are, things like pageNumber, limit, etc
 * are we handling that at the query level or local level
 * suggestion: we handle it at both, */
const queryManager = {
  specimen: {}, // these are mongoose search filters
  tokens: {},
  owners: {},
};
// track page number and limit in the gallery.html itself
const localPagination = {
  pageNumber: 1,
  pageLimit: 50,
  startFrom: 0,
};
const responseCache = {
  specimen: new Map(),
  token: new Map(),
  owners: new Map(),
};

// Query Data
export function setQueryData(resourceName, data = {}) {
  requireResource(resourceName);
  Object.assign(queryManager[resource], data);
}

// Pagination
export function setPagination(updates = {}) {
  for (const key in updates) {
    if (localPagination.hasOwnProperty(key)) {
      let value = updates[key];

      if (key === "pageLimit") {
        value > 200 ? 200 : value;
      }
      localPagination[key] = value;
    }
  }

  localPagination.startFrom =
    (localPagination.pageNumber - 1) * localPagination.pageLimit;
}

export function getPagination() {
  return localPagination;
}

// Cache
export function getQueryCache(resourceName) {
  requireResource(resourceName);
  const data = queryManager[resourceName];

  if (data) return data;
  else return queryManager;
}

export async function resourcePost(resourceName) {
  requireResource(resourceName);
  const apiUrl = "http://localhost:3000/api/";
  const reqBody = buildQueryRequest(resourceName);
  let data = [...specimenMockQuery, ...specimenMockQuery.reverse()];

  // fetch from server
  // const response = await fetch(apiUrl, {});

  // set response cache
  setResponseCache(resourceName);

  // testing only

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 3000);
  });
}

// === Private === //
function buildQueryRequest(resource = "") {
  const userInput = queryManager[resource];
  if (!userInput) throw new Error("invalid resource name");

  // userInput = { skill: 'brawler', class: null, search: 'Volk', limit: 50 }
  const reqBody = {
    resource,
    query: {},
  };

  Object.entries(userInput).forEach(([key, value]) => {
    if (key === "resource" || value === null || value === undefined) return;

    if (key === "search") {
      reqBody.query["$or"] = [
        { name: { $regex: value, $options: "i" } },
        { SID: { $regex: value, $options: "i" } },
      ];
    } else if (key === "limit" || key === "skip") {
      reqBody[key] = value;
    } else {
      reqBody.query[key] = value;
    }
  });

  return reqBody;
}

function setResponseCache(resource, data) {
  requireResource(resource);
  if (Array.isArray(data)) {
    // takes query params turns to string and parses maps it
    const params = JSON.stringify(queryManager[resource]);

    // set params->data;
    responseCache[resource].set(params, data);
  }
}

function getResponseCache(resource) {
  requireResource(resource);
  // takes query params turns to string and parses maps it
  const params = JSON.stringify(queryManager[resource]);

  // set params->data;
  const data = responseCache[resource].get(params);
  return data || [];
}

function requireResource(resource) {
  if (!resourceNames.includes(resource))
    throw new Error(`Resource named "${resource}" does not exist!`);
}

//------------------------------ DO NOT DELETE
// THIS NEEDS TO GO ON THE SERVER-SIDE
// const SpecimenModel = require('../models/Specimen'); // adjust based on your structure
// const models = {
//   specimen: SpecimenModel,
// add other models as needed
// };

async function handleQuery(req, res) {
  try {
    const { resource } = req.body;
    if (!resource || !models[resource]) {
      return res.status(400).json({ error: "Invalid resource type" });
    }

    const { filter, options } = buildMongoQueryFromBody(req.body);
    const results = await models[resource].find(filter, null, options).lean();

    return res.status(200).json(results);
  } catch (err) {
    console.error("Query failed:", err);
    return res.status(500).json({ error: "Server error during query." });
  }
}
