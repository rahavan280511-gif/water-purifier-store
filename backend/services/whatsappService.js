const https = require('https');

const PHONE   = process.env.WHATSAPP_NUMBER;   // e.g. 917639286990
const API_KEY = process.env.CALLMEBOT_APIKEY;  // From CallMeBot setup

/**
 * Sends a WhatsApp message to the owner via CallMeBot (free API).
 * @param {string} text - Plain text message to send.
 * @returns {Promise<void>}
 */
const sendWhatsAppMessage = (text) => {
    return new Promise((resolve, reject) => {
        if (!PHONE || !API_KEY) {
            console.warn('CallMeBot credentials not configured. Skipping WhatsApp notification.');
            return resolve();
        }

        const encoded = encodeURIComponent(text);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${encoded}&apikey=${API_KEY}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ WhatsApp notification sent via CallMeBot.');
                    resolve();
                } else {
                    console.error(`❌ CallMeBot error ${res.statusCode}:`, data);
                    reject(new Error(`CallMeBot responded with status ${res.statusCode}`));
                }
            });
        }).on('error', (err) => {
            console.error('❌ CallMeBot request failed:', err.message);
            reject(err);
        });
    });
};

/**
 * Sends an order notification via WhatsApp to the business owner.
 * @param {Object} order - The saved order object.
 */
const sendOrderNotification = async (order) => {
    const message = [
        `🛒 *New Order Received!*`,
        ``,
        `*Product:* ${order.productName}`,
        `*Quantity:* ${order.quantity}`,
        ``,
        `*Customer:* ${order.customerName}`,
        `*Phone:* ${order.phoneNumber}`,
        `*Address:* ${order.address}`,
        ``,
        `_Placed on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}_`
    ].join('\n');

    await sendWhatsAppMessage(message);
};

/**
 * Sends a service request notification via WhatsApp to the business owner.
 * @param {Object} request - The saved service request object.
 */
const sendServiceNotification = async (request) => {
    const message = [
        `🔧 *New Service Request!*`,
        ``,
        `*Customer:* ${request.name}`,
        `*Phone:* ${request.phone}`,
        `*Address:* ${request.address || 'Not provided'}`,
        `*Issue:* ${request.issue || 'Not specified'}`,
        ``,
        `_Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}_`
    ].join('\n');

    await sendWhatsAppMessage(message);
};

module.exports = { sendOrderNotification, sendServiceNotification };
