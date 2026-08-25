import { STORE_CONFIG } from '../config/storeConfig';
import { formatPrice } from './formatters';

/**
 * Generates formatted WhatsApp order message and direct link
 */
export const buildWhatsAppMessage = (cartItems, customerDetails) => {
  const { name, phone, orderType, address, landmark, instructions } = customerDetails;
  
  // Calculate total items count and subtotal
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Build items lines
  const itemsText = cartItems.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    return `${index + 1}. ${item.brand} ${item.name} (${item.packSize}) × ${item.quantity} = ${formatPrice(itemTotal)}`;
  }).join('\n');

  let message = `Hello ${STORE_CONFIG.name},\n\n`;
  message += `I would like to place an order from your website:\n\n`;
  message += `--- *ORDER ITEMS* ---\n`;
  message += `${itemsText}\n\n`;
  message += `*Total Estimated Subtotal:* ${formatPrice(subtotal)} (${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'})\n\n`;
  message += `--- *CUSTOMER DETAILS* ---\n`;
  message += `*Name:* ${name.trim()}\n`;
  message += `*Phone:* ${phone.trim()}\n`;
  message += `*Order Type:* ${orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}\n`;
  
  if (orderType === 'delivery' && address) {
    message += `*Delivery Address:* ${address.trim()}\n`;
    if (landmark && landmark.trim()) {
      message += `*Landmark:* ${landmark.trim()}\n`;
    }
  }
  
  if (instructions && instructions.trim()) {
    message += `*Notes/Instructions:* ${instructions.trim()}\n`;
  }
  
  message += `\n${STORE_CONFIG.policies.orderConfirmationNote}\n\n`;
  message += `Thank you!`;

  return message;
};

/**
 * Creates the complete wa.me URL
 */
export const createWhatsAppUrl = (cartItems, customerDetails) => {
  const message = buildWhatsAppMessage(cartItems, customerDetails);
  const encodedText = encodeURIComponent(message);
  
  const targetNumber = STORE_CONFIG.contact.whatsappNumber 
    ? STORE_CONFIG.contact.whatsappNumber.replace(/[^0-9]/g, '') 
    : '';

  if (!targetNumber) {
    return `https://wa.me/?text=${encodedText}`;
  }
  
  return `https://wa.me/${targetNumber}?text=${encodedText}`;
};
