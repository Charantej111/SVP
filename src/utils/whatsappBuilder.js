import { STORE_CONFIG } from '../config/storeConfig';
import { formatPrice } from './formatters';

/**
 * Generates formatted WhatsApp order message and direct link with delivery location coordinates & map link
 */
export const buildWhatsAppMessage = (cartItems, customerDetails, deliveryLocation = null) => {
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
  message += `--- *CUSTOMER & DELIVERY DETAILS* ---\n`;
  message += `*Name:* ${name.trim()}\n`;
  message += `*Phone:* ${phone.trim()}\n`;
  message += `*Order Type:* ${orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}\n`;
  
  if (orderType === 'delivery') {
    if (address) {
      message += `*Delivery Address:* ${address.trim()}\n`;
    }
    if (landmark && landmark.trim()) {
      message += `*Landmark:* ${landmark.trim()}\n`;
    }
    // If coordinates are available, provide a direct Google Maps pin link
    if (deliveryLocation?.latitude && deliveryLocation?.longitude) {
      message += `*Google Maps Pin:* https://maps.google.com/?q=${deliveryLocation.latitude},${deliveryLocation.longitude}\n`;
      if (deliveryLocation.shortAddress) {
        message += `*Area / Mandal:* ${deliveryLocation.shortAddress}\n`;
      }
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
export const createWhatsAppUrl = (cartItems, customerDetails, deliveryLocation = null) => {
  const message = buildWhatsAppMessage(cartItems, customerDetails, deliveryLocation);
  const encodedText = encodeURIComponent(message);
  
  const targetNumber = STORE_CONFIG.contact.whatsappNumber 
    ? STORE_CONFIG.contact.whatsappNumber.replace(/[^0-9]/g, '') 
    : '';

  if (!targetNumber) {
    return `https://wa.me/?text=${encodedText}`;
  }
  
  return `https://wa.me/${targetNumber}?text=${encodedText}`;
};
