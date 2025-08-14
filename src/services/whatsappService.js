// Mock WhatsApp Service

const sendMessage = async (to, message) => {
  console.log(`Sending WhatsApp message to ${to}: "${message}"`);
  // In a real application, this would interact with the WhatsApp API
  return { success: true, messageId: `msg_${Date.now()}` };
};

const receiveMessage = async (from, message) => {
    console.log(`Received WhatsApp message from ${from}: "${message}"`);
    // This function would be called by the webhook
    // In this simulation, we will call it directly to test the logic
    return { success: true };
};

module.exports = {
  sendMessage,
  receiveMessage,
};
