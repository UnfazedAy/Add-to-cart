#!/usr/bin/node

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase Realtime Database Configuration
const appSettings = {
  databaseURL: "https://realtime-database-c1a84-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDb = ref(database, "shoppingList");

// DOM Elements
const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');

// Firebase Realtime Database Event Listener to update the DOM
onValue(shoppingListInDb, function(snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingListEl();
    for (let currentItem of itemsArray) {
      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet"
  }
});

// clear the input field
function clearInputFieldEl() {
  inputFieldEl.value = '';
}

// Append Item which is the value to Shopping List
function appendItemToShoppingListEl(item) {
  let [itemId, itemValue] = item;
  let newEl = document.createElement('li');
  newEl.textContent = itemValue;

  newEl.addEventListener('click', function() {
    let exactLocationOfItemInDb = ref(database, `shoppingList/${itemId}`)
    remove(exactLocationOfItemInDb)
});
  shoppingListEl.appendChild(newEl);
}

// Clear the Shopping List
function clearShoppingListEl() {
  shoppingListEl.innerHTML = '';
}

// Event Listeners for click on Add Button
addButtonEl.addEventListener('click', () => {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDb, inputValue);
  clearInputFieldEl();
});
