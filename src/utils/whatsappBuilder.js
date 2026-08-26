import { STORE_CONFIG } from '../config/storeConfig';
import { formatPrice } from './formatters';

/**
 * Generates formatted WhatsApp order message without map links, coordinates, or internal IDs.
 */
export const buildWhatsAppMessage = (cartItems, customerDetails, deliveryLocation = null) => {
  const { name, phone, orderType, address, landmark, instructions } = customerDetails;
  
  // Calculate total items count and subtotal
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Build items lines (Clean: Brand, Name, Pack Size, Quantity, Total Price)
  const itemsText = cartItems.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    const packSizeStr = item.packSize || item.pack_size ? ` (${item.packSize || item.pack_size})` : '';
    return `${index + 1}. ${item.brand} ${item.name}${packSizeStr} × ${item.quantity} = ${formatPrice(itemTotal)}`;
  }).join('\n');

  let message = `Hello ${STORE_CONFIG.name},\n\n`;
  message += `I would like to place an order from your website:\n\n`;
  message += `--- *ORDER ITEMS* ---\n`;
  message += `${itemsText}\n\n`;
  message += `*Total Estimated Subtotal:* ${formatPrice(subtotal)} (${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'})\n\n`;
  message += `--- *CUSTOMER DETAILS* ---\n`;
  message += `*Name:* ${name.trim()}\n`;
  message += `*Phone:* ${phone.trim()}\n`;
  message += `*Order Type:* ${orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}\n\n`;
  
  if (orderType === 'delivery') {
    message += `--- *DELIVERY DETAILS* ---\n`;
    if (address && address.trim()) {
      message += `*Address:* ${address.trim()}\n`;
    }

    if (deliveryLocation) {
      if (deliveryLocation.village) {
        message += `*Village / Locality:* ${deliveryLocation.village}\n`;
      }
      if (deliveryLocation.mandal) {
        message += `*Mandal:* ${deliveryLocation.mandal}\n`;
      }
      if (deliveryLocation.district) {
        message += `*District:* ${deliveryLocation.district}\n`;
      }
      if (deliveryLocation.pincode) {
        message += `*Pincode:* ${deliveryLocation.pincode}\n`;
      }
    } else {
      message += `*State:* Andhra Pradesh\n`;
    }

    if (landmark && landmark.trim()) {
      message += `*Landmark:* ${landmark.trim()}\n`;
    }
    message += `\n`;
  }
  
  if (instructions && instructions.trim()) {
    message += `*Special Instructions:* ${instructions.trim()}\n\n`;
  }
  
  message += `${STORE_CONFIG.policies.orderConfirmationNote}\n\n`;
  message += `Thank you!`;

  return message;
};

/**
 * Creates the wa.me URL.
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
