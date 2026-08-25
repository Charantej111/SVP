/**
 * Helper formatters for Currency and Text
 */

export const formatPrice = (amount) => {
  if (typeof amount !== 'number') return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const calculateDiscount = (price, mrp) => {
  if (!mrp || mrp <= price) return null;
  const diff = mrp - price;
  const percent = Math.round((diff / mrp) * 100);
  return {
    percent: `${percent}% OFF`,
    savingsAmount: diff,
    savingsText: `Save ₹${diff}`
  };
};
