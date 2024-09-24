// Function to save data to localStorage
function saveData(key, data) {
  const dataJson = JSON.stringify(data);
  localStorage.setItem(key, dataJson);
}

// Function to retrieve data from localStorage
function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Function to remove data from localStorage
function removeData(key) {
  localStorage.removeItem(key);
}

// Function to clear all data from localStorage
function clearStorage() {
  localStorage.clear();
}

// Function to get all keys in localStorage
function getAllKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
  }

  return keys;
}

export { saveData, getData, getAllKeys, removeData, clearStorage, getAllKeys };
