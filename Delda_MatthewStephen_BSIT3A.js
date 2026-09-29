'use strict';

const storeName = 'Corner Market';
const taxRate = 0.08;
const currencySymbol = '$';
const openHour = 8;
const closeHour = 21;
const maxDiscountPercent = 25;
const inventorySeed = [
  { id: 1, name: 'Apple', price: 0.5, qty: 120, category: 'produce', supplier: { name: 'FreshFarms', contact: { phone: '555-0101' } } },
  { id: 2, name: 'Bread', price: 2.75, qty: 40, category: 'bakery', supplier: { name: 'BakeHouse', contact: null } },
  { id: 3, name: 'Milk', price: 3.2, qty: 0, category: 'dairy', supplier: null },
  { id: 4, name: 'Cheese', price: 5.6, qty: 15, category: 'dairy', supplier: { name: 'DairyBest', contact: { phone: '555-0202' } } },
  { id: 5, name: 'Rice', price: 1.1, qty: 200, category: 'grain', supplier: { name: 'GrainCo', contact: { phone: '555-0303' } } },
];
const extraItems = [
  { id: 6, name: 'Eggs', price: 3.0, qty: 60, category: 'dairy', supplier: null },
  { id: 7, name: 'Butter', price: 4.25, qty: 25, category: 'dairy', supplier: { name: 'DairyBest', contact: null } },
];
const storeMetadata = { storeName, taxRate, currencySymbol };
const [firstSeedItem, secondSeedItem] = inventorySeed;

let totalItemsSold = 0;
let totalRevenue = 0;
let lowStockCount = 0;
let currentHour = 9;
let isStoreOpen = false;
let discountPercent = 10;
let receiptLines = [];
let logMessages = [];
let inventory = [...inventorySeed, ...extraItems];
let lastCustomerName = 'Guest';

const checkIsOpen = (hour) => hour >= openHour && hour < closeHour;

const formatPrice = (amount) =>
  `${currencySymbol}${amount.toFixed(2)}`;

const applyDiscount = (price, percent) => price * (1 - percent / 100);

const logEvent = (message) => {
  const stamp = `[${storeName}] ${message}`;
  logMessages.push(stamp);
  return stamp;
};

const buildReceiptLine = ({ name, price, qty }) =>
  `${name} x${qty} @ ${formatPrice(price)} = ${formatPrice(price * qty)}`;

isStoreOpen = checkIsOpen(currentHour);
logMessages.push(logEvent(`Store status checked at hour ${currentHour}`));

console.log(`${storeName} open status: ${isStoreOpen}`);

const [cheapestCategoryGuess, , thirdInventoryItem] = inventory;
let [applePrice, breadPrice] = [inventorySeed[0].price, inventorySeed[1].price];

console.log(`First seed item: ${firstSeedItem.name}, second seed item: ${secondSeedItem.name}`);
console.log(`Third inventory item name: ${thirdInventoryItem.name}`);
console.log(`Apple price: ${formatPrice(applePrice)}, Bread price: ${formatPrice(breadPrice)}`);

const { name: firstItemName, price: firstItemPrice } = firstSeedItem;
const { storeName: metaStoreName, taxRate: metaTaxRate } = storeMetadata;

console.log(`Destructured item: ${firstItemName} costs ${formatPrice(firstItemPrice)}`);
console.log(`Metadata says store is ${metaStoreName} with tax rate ${metaTaxRate}`);

const itemNames = inventory.map((item) => item.name);
const discountedInventory = inventory.map((item) => ({
  ...item,
  price: applyDiscount(item.price, discountPercent),
}));

console.log(`All item names: ${itemNames.join(', ')}`);

const inStockItems = inventory.filter((item) => item.qty > 0);
const dairyItems = inventory.filter((item) => item.category === 'dairy');

for (let i = 0; i < inStockItems.length; i += 1) {
  if (inStockItems[i].qty < 20) {
    lowStockCount += 1;
  }
}

console.log(`In-stock item count: ${inStockItems.length}, dairy item count: ${dairyItems.length}`);

const baseSummary = { storeName, isStoreOpen };
const fullSummary = { ...baseSummary, totalItemsSold, totalRevenue, lowStockCount };

const combinedNames = [...itemNames, 'Discount Coupon', 'Loyalty Card'];

const supplierContactInfo = discountedInventory.map((item) => ({
  itemName: item.name,
  supplierPhone: item?.supplier?.contact?.phone ?? 'N/A',
}));

const storeContactCard = {
  name: storeName,
  managerPhone: storeMetadata?.manager?.phone ?? 'unlisted',
};

for (const item of discountedInventory) {
  if (item.qty > 0) {
    const qtyToSell = Math.min(2, item.qty);
    totalItemsSold += qtyToSell;
    totalRevenue += item.price * qtyToSell;
    receiptLines.push(buildReceiptLine({ name: item.name, price: item.price, qty: qtyToSell }));
  }
}

const revenueWithTax = totalRevenue * (1 + taxRate);

console.log(`Receipt for ${lastCustomerName}:`);
receiptLines.forEach((line) => console.log(`  ${line}`));
console.log(`Subtotal: ${formatPrice(totalRevenue)} | With tax: ${formatPrice(revenueWithTax)}`);

console.log('--- Supplier contact info ---');
supplierContactInfo.forEach(({ itemName, supplierPhone }) => {
  console.log(`${itemName}: ${supplierPhone}`);
});

console.log('--- Store contact card ---');
console.log(storeContactCard);

console.log('--- Full summary ---');
console.log(fullSummary);

console.log('--- Combined names (with spread extras) ---');
console.log(combinedNames);

console.log('--- Cheapest category guess item ---');
console.log(cheapestCategoryGuess.category);

console.log('--- Discount percent capped by maxDiscountPercent ---');
discountPercent = Math.min(discountPercent, maxDiscountPercent);
console.log(`Effective discount percent: ${discountPercent}%`);

module.exports = {
  inventory,
  discountedInventory,
  fullSummary,
  supplierContactInfo,
  storeContactCard,
  combinedNames,
  receiptLines,
};
