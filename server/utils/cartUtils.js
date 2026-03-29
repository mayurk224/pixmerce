/**
 * Calculates the totals and extracts names from an array of DB items.
 */
export const calculateCartTotals = (items) => {
  let totalStartingPrice = 0;
  let totalMinPrice = 0;
  const itemNames = [];

  items.forEach(item => {
    totalStartingPrice += item.startingPrice;
    totalMinPrice += item.minPrice; 
    itemNames.push(item.name);
  });

  return { totalStartingPrice, totalMinPrice, itemNames };
};